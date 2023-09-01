import './styles/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/common/Footer";
import React from "react";
import Header from "./components/common/Header";
import {Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import {Provider} from "react-redux";
import store from "./redux/store";
import CertificateDetails from "./components/CertificateDetails";
import UserProfile from "./components/UserProfile";
import Auth from "./components/common/Auth";
import CertificateCreation from "./components/admin/CertificateCreation";
import TagCreation from "./components/admin/TagCreation";
import Checkout from "./components/Checkout";
import Error from "./components/common/Error";

function App() {
    return (
        <Provider store={store}>
            <Header/>
            <main>
                <Routes>
                    <Route element={<Auth allowedRoles={["GUEST","USER","ADMIN"]}/>}>
                        <Route path="/" element={<Home/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST","USER","ADMIN"]}/>}>
                        <Route path="/certificate/:certificateId" element={<CertificateDetails/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST"]}/>}>
                        <Route path="/login" element={<Login/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST"]}/>}>
                        <Route path="/register" element={<Register/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN", "USER"]}/>}>
                        <Route path="/profile" element={<UserProfile/>}/>
                    </Route>

                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/create-tag" element={<TagCreation/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/create-certificate" element={<CertificateCreation/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["USER"]}/>}>
                        <Route path="/checkout/:certificateId" element={<Checkout/>}/>
                    </Route>
                    <Route path="*" element={<Error/>} />
                </Routes>
            </main>
            <Footer/>
        </Provider>
    );
}

export default App;