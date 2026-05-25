import { create } from 'zustand'
import type { UserProfileDTO } from '../types/models/User';


type UserStore = {
    user: UserProfileDTO | null;
    setUser: (user: UserProfileDTO) => void;
    clearUser: () => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
    },
}))