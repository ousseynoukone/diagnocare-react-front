export interface LoginDTO{
    email : string;
    password: string;
}

export const Role = {
  PATIENT: 1,
  ADMIN: 2,
  DOCTOR: 3,
  OPERATOR: 4,
  SUPER_ADMIN: 5,
} as const;

export type Role = typeof Role[keyof typeof Role];


export interface RegisterDTO{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId: Role;
    lang: string;
}

export interface OtpSendDTO {
    email: string;
}

export interface OtpValidateDTO {
    email: string;
    code: string;
}

export interface RefreshTokenDTO {
    refreshToken: string;
}

export interface ResetPasswordDTO {
    email: string;
    code: string;
    newPassword?: string;
}
