import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfileDTO } from '../types/models/User';


type UserStore = {
    user: UserProfileDTO | null;
    setUser: (user: UserProfileDTO) => void;
    clearUser: () => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                set({ user: null });
            },
        }),
        {
            name: 'diagnocare-user',
        }
    )
)