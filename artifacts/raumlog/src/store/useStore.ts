import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GuestInfo = {
  name: string;
  email: string;
  phone: string;
};

export type BookingDraft = {
  spaceId: number;
  spaceTitle: string;
  spaceOwnerEmail: string;
  priceDaily: string;
  priceMonthly: string;
  checkIn: string;
  checkOut: string;
  days: number;
  months: number;
  totalPrice: number;
  itemsDescription: string;
  acceptedTerms: boolean;
  reservationId: number | null;
  status: "idle" | "pending" | "confirmed" | "paid";
};

type StoreState = {
  hostEmail: string;
  adminToken: string;
  guestInfo: GuestInfo;
  booking: BookingDraft | null;

  setHostEmail: (email: string) => void;
  setAdminToken: (token: string) => void;
  setGuestInfo: (info: Partial<GuestInfo>) => void;
  setBooking: (b: BookingDraft | null) => void;
  updateBooking: (b: Partial<BookingDraft>) => void;
  clearBooking: () => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      hostEmail: "",
      adminToken: "",
      guestInfo: { name: "", email: "", phone: "" },
      booking: null,

      setHostEmail: (email) => set({ hostEmail: email }),
      setAdminToken: (token) => set({ adminToken: token }),
      setGuestInfo: (info) =>
        set((s) => ({ guestInfo: { ...s.guestInfo, ...info } })),
      setBooking: (booking) => set({ booking }),
      updateBooking: (b) =>
        set((s) => ({
          booking: s.booking ? { ...s.booking, ...b } : null,
        })),
      clearBooking: () => set({ booking: null }),
    }),
    {
      name: "raumlog-store",
      partialize: (s) => ({
        hostEmail: s.hostEmail,
        guestInfo: s.guestInfo,
      }),
    }
  )
);
