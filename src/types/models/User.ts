import { Role } from "./Auth";

export interface UserProfileDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    lang?: string;
    role: Role;
    emailVerified?: boolean;
}

// Converts the raw API user into the frontend-friendly DTO
export function toUserProfileDTO(apiUser: any): UserProfileDTO {
    let role: Role = Role.PATIENT;

    if (apiUser.roles && Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
        role = (apiUser.roles[0].id ?? apiUser.roles[0]) as Role;
    }

    return {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        phoneNumber: apiUser.phoneNumber ?? '',
        lang: apiUser.lang ?? 'fr',
        role,
        emailVerified: apiUser.emailVerified !== undefined ? apiUser.emailVerified : true,
    };
}
