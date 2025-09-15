import { Alert } from 'react-native';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    const minLength = 6;
    return password.length >= minLength;
};

export const validateRequiredField = (value: string): boolean => {
    return value.trim().length > 0;
};

export const showAlert = (message: string): void => {
    Alert.alert('Validation Error', message, [{ text: 'OK' }]);
};