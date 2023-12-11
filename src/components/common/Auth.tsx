import {Navigate, Outlet, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getUser, getUserFromStorage, setUserInStorage} from "../../utils/userUtils";
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
                const adminUser = await getUser();
                if (adminUser.role === ADMIN)
                    setIsAdmin(true);
                else
                    setUserInStorage(adminUser)
            }
        }

        checkUser();
    }, [user]);

    const allowedUnauthorized = ["/", "/login", "/register", "/activate-account"].includes(location.pathname) || location.pathname.includes("/certificate/")
    if (user == null) {
        if (allowedUnauthorized)
            return <Outlet/>
        else
            return <Navigate to="/login" replace/>
    } else if (allowedRoles.includes(user.role)) {
        return <Outlet/>
    } else {
        return <Navigate to="/profile" replace/>
    }
};

export default Auth;