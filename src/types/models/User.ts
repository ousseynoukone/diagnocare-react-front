import { Role } from "./Auth";

export interface UserProfileDTO {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

// Converts the raw API user into the frontend-friendly DTO
export function toUserProfileDTO(apiUser: any): UserProfileDTO {
    const primaryRole = apiUser.roles[0];
    return {
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        role: primaryRole.id as Role,
    };
}
