import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { AuthContext } from '../App';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const getUserData = async (uid) => {
        const userUid = uid? uid : auth.currentUser.uid;
        const docSnap = await getDoc(doc(db, 'users', userUid));
        const data = docSnap.data();

        setUser(data);
        setLoadingData(false);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                getUserData(user.uid);
            } else {
                setUser(null);
                setLoadingData(false);
            }
        })
    }, [])

    const value = {
        user,
        getUserData,
        loadingData
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;