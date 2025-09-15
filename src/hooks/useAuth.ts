import { useState, useEffect } from 'react';
import { auth } from '../services/firebase'; // Adjust the import based on your firebase setup
import { User } from '../types'; // Assuming you have a User type defined in your types

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        }, (error) => {
            setError(error.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await auth.signOut();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, signIn, signUp, signOut };
};

export default useAuth;