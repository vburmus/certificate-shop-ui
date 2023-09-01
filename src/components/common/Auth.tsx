import {Navigate, Outlet, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUser, getUserFromStorage, setUserInStorage} from "../../utils/userUtils";
import AdminUI from "../admin/AdminUI";
import Home from "../Home";
import {ADMIN} from "../../utils/constants";

interface AuthProps {
    allowedRoles: string[]
}

const Auth: React.FC<AuthProps> = ({allowedRoles}) => {
    const user = getUserFromStorage();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function checkUser() {
            if (user && user.role === ADMIN) {
                const adminUser = await getUser(user.id);
                if (adminUser.role === ADMIN)
                    setIsAdmin(true);
                else
                    setUserInStorage(adminUser)
            }
        }
        checkUser();
    }, [user]);

    const allowedUnauthorized = ["/", "/login", "/register"].includes(location.pathname) || location.pathname.includes("/certificate/")
    if (user == null) {
        if (allowedUnauthorized)
            return <Outlet/>
        else
            return <Navigate to="/login" replace/>
    } else if (allowedRoles.includes(user.role)) {
        if (user.role === ADMIN) {
            if (isAdmin) {
                if (location.pathname === "/")
                    return <AdminUI/>
                return <Outlet/>
            } else
                return <Home/>
        }
        return <Outlet/>
    } else {
        return <Navigate to="/profile" replace/>
    }
};

export default Auth;