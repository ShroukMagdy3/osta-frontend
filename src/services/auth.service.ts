import { api } from '@/api/axios';
import {
  RegisterUserData,
  LoginData,
  AuthResponse,
  AuthUser,
} from '@/types/auth.types';

interface CompleteClientProfileData {
  phone: string;
  governorate: string;
  city: string;
  gender: string;
}

// For user 
export const registerUser = (data: RegisterUserData) => {
  return api.post<AuthResponse>('/auth/register/user', data);
};

export const registerTechnician = (data: RegisterUserData) => {
  return api.post<AuthResponse>('/auth/register/technician', data);
};

export const loginUser = (data: LoginData) => {
  return api.post<AuthResponse>('/auth/login', data);
};

export const getCurrentUser = () => {
  return api.get<{ data: AuthUser }>('/auth/me');
};

export const resendVerificationEmail = () => {
  return api.post('/auth/send-verification');
};

export const logoutUser = () => {
  return api.get('/auth/logout');
};

export const refreshToken = () => {
  return api.get('/auth/refresh');
};

export const completeClientProfile = (data: CompleteClientProfileData) => {
  return api.patch('/users/me', data);
};
