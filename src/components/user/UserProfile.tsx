import React, {useEffect, useState} from 'react';
import {getUserData, getUserFromStorage} from "../../utils/userUtils";
import {Image} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {ADMIN} from "../../utils/constants";
import {User} from "../../utils/types";
import {isAxiosError} from "axios";
import Loader from "../common/Loader";

const UserProfile = () => {
    const {id} = useParams();
    const userId = id ? parseInt(id) : -1
    const userSt = getUserFromStorage()
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const loadUser = async () => {
        try {
            setIsLoading(true);
            setUser(await getUserData(userId))
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                setError(e.response.data.detail);
            }
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (user && user.role != ADMIN && userId != user.id) {
            setError("404 Not Found")
        } else {
            loadUser()
        }
        console.log(user)
    }, []);
    return (isLoading ? <Loader/> : !error && user ?
            <section className="bg-white user-container d-flex flex-row flex-wrap gap-5 col-8 p-5 rounded">
                <div className="col-12 col-lg-5 image-container-500">
                    <Image src={user.imageUrl} className="scaled-image rounded"/>
                </div>
                <div className="d-flex flex-column col-12 col-lg-5 justify-content-center">
                    <h4>{user.surname} {user.name}</h4>
                    <hr/>
                    <h5>{user.email}</h5>
                    <hr/>
                    <h5>{user.phone}</h5>
                    {userSt?.role != ADMIN &&
                        <Link className="btn btn-info text-white" to={"/profile/orders"}>Order History</Link>}
                </div>

            </section> : <h5>{error}</h5>
    );
};

export default UserProfile;