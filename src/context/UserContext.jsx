import React, { createContext, useState, useEffect } from "react";
import { isLoggedIn, getUserInfo, clearAuthStorage } from "../utils/authStorage";
import { getUser } from "../api/auth";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [userInfo, setUserInfoState] = useState(null);

    const fetchUserInfo = async () => {
        if (!isLoggedIn()) return;
        try {
            const result = await getUser();
            const users = result.data ?? result;
            const stored = getUserInfo();
            let me;
            if (Array.isArray(users)) {
                me = users.find(
                    (u) =>
                        Number(u.id) === Number(stored?.id) ||
                        (stored?.email && u.email === stored.email)
                );
            } else {
                me = users;
            }
            if (me) setUserInfoState(me);
        } catch {
            // token expired or network error
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const setUserInfo = (info) => {
        setUserInfoState(info);
    };

    const refreshUserInfo = () => fetchUserInfo();

    const logout = () => {
        clearAuthStorage();
        setUserInfoState(null);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, refreshUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext };
