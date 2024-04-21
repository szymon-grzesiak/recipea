import { create } from "zustand";

const useStore = create((set) => ({
  favorites: {},
  addFavorite: (userId, postId) =>
    set((state) => ({
      favorites: { ...state.favorites, [`${userId}-${postId}`]: true },
    })),
  removeFavorite: (userId, postId) =>
    set((state) => ({
      favorites: { ...state.favorites, [`${userId}-${postId}`]: false },
    })),
}));

export default useStore;
