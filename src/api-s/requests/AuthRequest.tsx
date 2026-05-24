import type { LoginDTO, RegisterDTO, OtpSendDTO, OtpValidateDTO, RefreshTokenDTO, ResetPasswordDTO } from "../../types/models/Auth";
import { apiClient } from '../AxiosApiClient';

// Authenticate user and store JWT token in localStorage
export function AuthRequest(login: LoginDTO) {
    return apiClient.post('/auth/login', login)
        .then(response => {
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data;
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

// Refresh the access token using a refresh token
export function RefreshTokenRequest(refreshTokenData: RefreshTokenDTO) {
    return apiClient.post('/auth/refresh-token', refreshTokenData)
        .then(response => {
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            return response.data;
        })
        .catch(error => {
            console.error('Token refresh failed:', error);
            throw error;
        });
}

// Reset password request (sends verification code to the email)
export function ResetPasswordRequest(email: string) {
    return SendOtpRequest({ email })
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

