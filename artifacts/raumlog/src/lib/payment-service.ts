/**
 * @file payment-service.ts
 * @module RaumLog/CommissionEngine
 *
 * Motor de comisiones para RaumLog.
 *
 * ## Modelos de comisión
 * - **Escenario A** (1–5 meses): 20% del total público.
 * - **Escenario B** (6+ meses): 1 mes de renta fijo como comisión.
 * - **IVA**: 19% sobre el precio público, siempre a cargo del cliente.
 */

/** Threshold in months above which the long-stay flat model applies */
const LONG_STAY_MONTHS = 6;

export interface BookingBreakdown {
  /** Space base price (what the listing shows). Commission is extracted from this. */
  publicTotal: number;
  hostNetTotal: number;
  commission: number;
  /** IVA 19% on publicTotal — charged on top, paid by the user, remitted to DIAN */
  ivaAmount: number;
  /** Total the user actually pays: publicTotal + ivaAmount */
  userTotal: number;
  isLongStay: boolean;
  /** For short-stay: percentage rate (0.20). For long-stay: null (flat 1-month model). */
  commissionRate: number | null;
  /** Human-readable commission description */
  commissionLabel: string;
  /** Amortised monthly commission amount (long-stay only, for display) */
  monthlyCommissionAmortised: number | null;
}

export interface CalculatorScenarios {
  /** Scenario A — 1 to 5 months, 20% flat */
  shortStay: {
    publicMonthly: number;
    commission: number;
    hostNet: number;
  };
  /** Scenario B — 6+ months, 1-month flat commission */
  longStay: {
    /** Example at 6 months */
    exampleMonths: number;
    publicTotal: number;
    commission: number;
    hostNetTotal: number;
    effectiveRate: number;
  };
}

export const CommissionEngine = {
  /**
   * Compute the full booking breakdown based on duration.
   *
   * Scenario A (< 6 months): 20% of total paid by guest.
   * Scenario B (≥ 6 months): 1 month of public rent as flat commission.
   *
   * @param months    Number of full months (0 means daily pricing is used)
   * @param days      Total days (used only when months === 0)
   * @param publicMonthly  Published monthly price that the guest pays
   * @param publicDaily    Published daily price that the guest pays
   */
  getBookingBreakdown(
    months: number,
    days: number,
    publicMonthly: number,
    publicDaily: number
  ): BookingBreakdown {
    const isLongStay = months >= LONG_STAY_MONTHS;

    if (months > 0) {
      const publicTotal = months * publicMonthly;

      if (isLongStay) {
        // Scenario B: 1 month flat
        const commission = publicMonthly;
        const hostNetTotal = publicTotal - commission;
        const monthlyCommissionAmortised = commission / months;
        const ivaAmount = Math.round(publicTotal * 0.19);
        const userTotal = publicTotal + ivaAmount;
        return {
          publicTotal,
          hostNetTotal,
          commission,
          ivaAmount,
          userTotal,
          isLongStay: true,
          commissionRate: null,
          commissionLabel: `1 mes fijo (${((1 / months) * 100).toFixed(1)}% efectivo)`,
          monthlyCommissionAmortised,
        };
      } else {
        // Scenario A: 20%
        const commission = Math.round(publicTotal * 0.2);
        const hostNetTotal = publicTotal - commission;
        const ivaAmount = Math.round(publicTotal * 0.19);
        const userTotal = publicTotal + ivaAmount;
        return {
          publicTotal,
          hostNetTotal,
          commission,
          ivaAmount,
          userTotal,
          isLongStay: false,
          commissionRate: 0.2,
          commissionLabel: "20%",
          monthlyCommissionAmortised: null,
        };
      }
    } else {
      // Daily pricing — always 20%
      const publicTotal = days * publicDaily;
      const commission = Math.round(publicTotal * 0.2);
      const hostNetTotal = publicTotal - commission;
      const ivaAmount = Math.round(publicTotal * 0.19);
      const userTotal = publicTotal + ivaAmount;
      return {
        publicTotal,
        hostNetTotal,
        commission,
        ivaAmount,
        userTotal,
        isLongStay: false,
        commissionRate: 0.2,
        commissionLabel: "20%",
        monthlyCommissionAmortised: null,
      };
    }
  },

  /**
   * For the OfferSpace calculator: generate both scenario previews
   * from the host's desired monthly net price.
   */
  getScenarios(desiredNetMonthly: number): CalculatorScenarios {
    // Scenario A: 20% model
    const publicMonthly = desiredNetMonthly / 0.8;
    const commissionA = publicMonthly * 0.2;

    // Scenario B example at 6 months
    const exampleMonths = 6;
    const publicTotalB = exampleMonths * publicMonthly;
    const commissionB = publicMonthly; // 1 month flat
    const hostNetTotalB = publicTotalB - commissionB;

    return {
      shortStay: {
        publicMonthly,
        commission: commissionA,
        hostNet: desiredNetMonthly,
      },
      longStay: {
        exampleMonths,
        publicTotal: publicTotalB,
        commission: commissionB,
        hostNetTotal: hostNetTotalB,
        effectiveRate: commissionB / publicTotalB,
      },
    };
  },

  // ── Legacy helpers (backwards compatibility) ──────────────────────────────

  getPublicPrice(desiredNetPrice: number): number {
    return desiredNetPrice / 0.8;
  },
  getCommission(desiredNetPrice: number): number {
    return CommissionEngine.getPublicPrice(desiredNetPrice) - desiredNetPrice;
  },
  getHostNet(publicPrice: number): number {
    return publicPrice * 0.8;
  },
  getPlatformCut(publicPrice: number): number {
    return publicPrice * 0.2;
  },
};

