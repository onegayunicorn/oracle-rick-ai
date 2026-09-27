import { create } from "zustand";

export const useAvatarState = create((set) => ({
  currentAnimation: "Idle",

  setAnimation: (animation) => {
    set({ currentAnimation: animation });
  },
}));
