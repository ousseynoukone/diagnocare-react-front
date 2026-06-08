import type { LoginDTO, RegisterDTO, OtpSendDTO, OtpValidateDTO, ResetPasswordDTO } from "../../types/models/Auth";
import { apiClient } from '../AxiosApiClient';

// Authenticate user — tokens are set as HttpOnly cookies by the server
export function AuthRequest(login: LoginDTO) {
    return apiClient.post('/auth/login', login)
        .then(response => {
            // Response body only contains { user: {...} }
            // Tokens are in HttpOnly cookies — inaccessible to JS
            const payload = response.data.data ?? response.data;
            return payload;
        })
        .catch(error => {
            console.error('Login failed:', error);
            throw error;
        });
}

// Create a new user account
export function RegisterRequest(registerData: RegisterDTO) {
    return apiClient.post('/auth/register', registerData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Registration failed:', error);
            throw error;
        });
}

// Send an OTP code to user's email for verification or password reset
export function SendOtpRequest(otpData: OtpSendDTO) {
    return apiClient.post('/auth/otp/send', otpData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Sending OTP failed:', error);
            throw error;
        });
}

// Validate the email OTP code
export function ValidateOtpRequest(otpData: OtpValidateDTO) {
    return apiClient.post('/auth/otp/validate', otpData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('OTP validation failed:', error);
            throw error;
        });
}

// Refresh the access token — no body needed, the browser sends the refreshToken cookie automatically
export function RefreshTokenRequest() {
    return apiClient.post('/auth/refresh-token', {})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Token refresh failed:', error);
            throw error;
        });
}

// Reset password request (sends verification code to the email)
export function ResetPasswordRequest(email: string) {
    return SendOtpRequest({ email, purpose: 'reset_password' })
        .catch(error => {
            console.error('Reset password request failed:', error);
            throw error;
        });
}

// Reset password confirmation (validates OTP and sets the new password)
export function ResetPasswordConfirmRequest(resetData: ResetPasswordDTO) {
    return apiClient.post('/auth/reset-password', resetData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Reset password confirmation failed:', error);
            throw error;
        });
}

// Super Admin force-resets another user's password (no current password needed)
export function AdminSetPasswordRequest(userId: number, newPassword: string) {
    return apiClient.put(`/auth/admin/users/${userId}/set-password`, { newPassword })
        .then(r => r.data);
}

// Authenticated user changes their own password (current password required)
export function ChangePasswordRequest(userId: number, currentPassword: string, newPassword: string) {
    return apiClient.put(`/auth/users/${userId}/change-password`, { currentPassword, newPassword })
        .then(r => r.data);
}

// Logout — asks the server to clear the HttpOnly cookies
export function LogoutRequest() {
    return apiClient.post('/auth/logout', {})
        .catch(error => {
            console.error('Logout failed:', error);
            throw error;
        });
}
