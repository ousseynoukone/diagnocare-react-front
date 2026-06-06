import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfileDTO } from '../types/models/User';
import { toUserProfileDTO } from '../types/models/User';
import { apiClient } from '../api-s/AxiosApiClient';

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    lang?: string;
    password?: string;
}

type UserStore = {
    user: UserProfileDTO | null;
    setUser: (user: UserProfileDTO) => void;
    clearUser: () => void;
    updateUser: (payload: UpdateUserPayload) => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            updateUser: async (payload: UpdateUserPayload) => {
                const user = get().user;
                if (!user?.id) throw new Error('No user logged in');
                const response = await apiClient.put(`/auth/users/${user.id}`, payload);
                const updated = toUserProfileDTO(response.data?.data ?? response.data);
                set({ user: updated });
            },
            logout: async () => {
                try {
                    await apiClient.post('/auth/logout', {});
                    set({ user: null });
                } catch (error) {
                    console.error("Failed to log out from server:", error);
                    throw error;
                }
            },
        }),
        {
            name: 'diagnocare-user',
        }
    )
)