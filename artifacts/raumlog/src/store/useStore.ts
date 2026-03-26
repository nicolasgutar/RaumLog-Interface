import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/lib/auth-api";

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

  authToken: string;
  authUser: AuthUser | null;

  setHostEmail: (email: string) => void;
  setAdminToken: (token: string) => void;
  setGuestInfo: (info: Partial<GuestInfo>) => void;
  setBooking: (b: BookingDraft | null) => void;
  updateBooking: (b: Partial<BookingDraft>) => void;
  clearBooking: () => void;

  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      hostEmail: "",
      adminToken: "",
      guestInfo: { name: "", email: "", phone: "" },
      booking: null,
      authToken: "",
      authUser: null,

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

      setAuth: (token, user) => set({ authToken: token, authUser: user }),
      clearAuth: () => set({ authToken: "", authUser: null }),
    }),
    {
      name: "raumlog-store",
      partialize: (s) => ({
        hostEmail: s.hostEmail,
        guestInfo: s.guestInfo,
        authToken: s.authToken,
        authUser: s.authUser,
      }),
    }
  )
);
