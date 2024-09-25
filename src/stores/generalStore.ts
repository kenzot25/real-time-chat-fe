import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GeneralState {
  isProfileSettingsModalOpen: boolean;
  isLoginModalOpen: boolean;
  isCreateRoomModalOpen: boolean;
  toggleProfileSettingsModal: () => void;
  toggleCreateRoomModal: () => void;
}

export const useGeneralStore = create<GeneralState>()(
  persist(
    (set) => ({
      isLoginModalOpen: false,
      isProfileSettingsModalOpen: false,
      isCreateRoomModalOpen: false,
      toggleProfileSettingsModal: () =>
        set((state) => ({
          isProfileSettingsModalOpen: !state.isProfileSettingsModalOpen,
        })),

      toggleCreateRoomModal: () =>
        set((state) => ({
          isCreateRoomModalOpen: !state.isCreateRoomModalOpen,
        })),
    }),
    {
      name: "general-store",
    }
  )
);
