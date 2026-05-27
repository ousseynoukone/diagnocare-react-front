import { Role } from "./Auth";

export interface UserProfileDTO {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

// Converts the raw API user into the frontend-friendly DTO
export function toUserProfileDTO(apiUser: any): UserProfileDTO {
    let role: Role;

    if (apiUser.roles && Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
        // API returns roles as an array of objects with an `id`
        role = (apiUser.roles[0].id ?? apiUser.roles[0]) as Role;
    } else if (apiUser.role && typeof apiUser.role === 'object') {
        // API returns a single role object
        role = (apiUser.role.id ?? apiUser.role) as Role;
    } else if (apiUser.roleId != null) {
        // API returns just a roleId
        role = apiUser.roleId as Role;
    } else {
        role = 1 as Role;
    }

    return {
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        role,
    };
}
