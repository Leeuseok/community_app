// useAuth 훅
// - Firebase Auth 상태를 구독하여 현재 사용자(user), 로딩 상태(loading), 에러(error)를 제공
// - signIn(email, password), signUp(email, password), signOut() 함수를 제공

import { useState, useEffect } from 'react';
import { auth } from '../services/firebase'; // Adjust the import based on your firebase setup
import { User } from '../types'; // Assuming you have a User type defined in your types
import {
    onAuthStateChanged,
    signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
    createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
    signOut as fbSignOut,
    updateProfile as fbUpdateProfile,
} from 'firebase/auth';

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (u) => {
                setUser(u as unknown as User);
                setLoading(false);
            },
            (err) => {
                setError((err as Error).message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await fbSignInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError((err as Error).message ?? String(err));
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name?: string) => {
        setLoading(true);
        try {
            const cred = await fbCreateUserWithEmailAndPassword(auth, email, password);
            if (name && cred.user) {
                await fbUpdateProfile(cred.user, { displayName: name });
            }
        } catch (err) {
            setError((err as Error).message ?? String(err));
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await fbSignOut(auth);
        } catch (err) {
            setError((err as Error).message ?? String(err));
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, signIn, signUp, signOut };
};

export default useAuth;