"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  GreenPrintState, defaultState,
  PowerAnswers, TransportAnswers, CookingAnswers, FoodAnswers, GoodsAnswers, WasteAnswers, Result,
} from "./state";

interface StoreActions {
  setFirstName: (name: string) => void;
  setLocation: (state: string, city: string) => void;
  setHouseholdSize: (size: number) => void;
  setPowerAnswers: (answers: PowerAnswers) => void;
  setTransportAnswers: (answers: TransportAnswers) => void;
  setCookingAnswers: (answers: CookingAnswers) => void;
  setFoodAnswers: (answers: FoodAnswers) => void;
  setGoodsAnswers: (answers: GoodsAnswers) => void;
  setWasteAnswers: (answers: WasteAnswers) => void;
  setResult: (result: Result) => void;
  setCurrentStep: (step: string) => void;
  toggleAction: (actionId: string) => void;
  reset: () => void;
}

export type Store = GreenPrintState & StoreActions;

const safeStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    // dummy no-op storage for SSR — skipHydration ensures this is never really used
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return localStorage;
});

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...defaultState,

      setFirstName: (firstName) =>
        set((s) => ({ profile: { ...s.profile, firstName } })),

      setLocation: (state, city) =>
        set((s) => ({ profile: { ...s.profile, state, city } })),

      setHouseholdSize: (householdSize) =>
        set((s) => ({ profile: { ...s.profile, householdSize } })),

      setPowerAnswers: (power) =>
        set((s) => ({ answers: { ...s.answers, power } })),

      setTransportAnswers: (transport) =>
        set((s) => ({ answers: { ...s.answers, transport } })),

      setCookingAnswers: (cooking) =>
        set((s) => ({ answers: { ...s.answers, cooking } })),

      setFoodAnswers: (food) =>
        set((s) => ({ answers: { ...s.answers, food } })),

      setGoodsAnswers: (goods) =>
        set((s) => ({ answers: { ...s.answers, goods } })),

      setWasteAnswers: (waste) =>
        set((s) => ({ answers: { ...s.answers, waste } })),

      setResult: (result) => set({ result }),

      setCurrentStep: (currentStep) => set({ currentStep }),

      toggleAction: (actionId) =>
        set((s) => {
          const existing = s.plan.addedActions;
          const updated = existing.includes(actionId)
            ? existing.filter((id) => id !== actionId)
            : [...existing, actionId];
          return { plan: { ...s.plan, addedActions: updated } };
        }),

      reset: () =>
        set({ ...defaultState, rotationSeed: Math.floor(Math.random() * 10000) }),
    }),
    {
      name: "greenprint-state",
      storage: safeStorage,
      skipHydration: true,
    }
  )
);
