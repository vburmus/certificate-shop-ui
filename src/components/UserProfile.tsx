import React from 'react';
import {getUserFromStorage} from "../utils/userUtils";
import {Image} from "react-bootstrap";

const UserProfile = () => {
    const user = getUserFromStorage()
  return (user &&
    <section className="user-container d-flex flex-row flex-wrap gap-5 col-8 py-5">
        <div className=" col-12 col-lg-5 ">
        <Image src={user.imageURL} className="scaled-image"/>
        </div>
        <div className="d-flex flex-column col-12 col-lg-5 justify-content-center">
            <h4>{user.surname}</h4>
            <h4>{user.name}</h4>
            <hr/>
            <h5>{user.email}</h5>
            <hr/>
            <h5>{user.number}</h5>
        </div>
    </section>
  );
};

export default UserProfile;