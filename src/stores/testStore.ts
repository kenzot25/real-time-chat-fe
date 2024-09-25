import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkState {
  isWorked: boolean;
  toggleIsWorked: () => void;
}

export const useWorkStore = create<WorkState>()(
  persist(
    (set) => ({
      isWorked: false,
      toggleIsWorked: () =>
        set((state) => ({
          isWorked: !state.isWorked,
        })),
    }),
    {
      name: "work-store",
    }
  )
);
