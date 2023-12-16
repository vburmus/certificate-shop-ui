import './styles/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/common/Footer";
import React from "react";
import Header from "./components/common/Header";
import {Route, Routes} from "react-router-dom";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import {Provider} from "react-redux";
import store from "./redux/store";
import CertificateDetails from "./components/certificates/CertificateDetails";
import UserProfile from "./components/user/UserProfile";
import Auth from "./components/common/Auth";
import CertificateCreation from "./components/admin/certificates/CertificateCreation";
import TagCreation from "./components/admin/tags/TagCreation";
import Checkout from "./components/cart/Checkout";
import Error from "./components/common/Error";
import Home from "./components/Home";
import {ToastContainer} from "react-toastify";
import ActivateAccount from "./components/user/AccountActivation";
import OrderList from "./components/user/orders/OrderList";
import AdminCertificatesPage from "./components/admin/certificates/AdminCertificatesPage";
import {AdminControlPanel} from "./components/admin/AdminControlPanel";
import AdminTagsPage from "./components/admin/tags/AdminTagsPage";
import AdminOrdersPage from "./components/admin/orders/AdminOrdersPage";

function App() {
    return (
        <Provider store={store}>
            <Header/>
            <main>
                <Routes>
                    <Route element={<Auth allowedRoles={["GUEST", "USER", "ADMIN"]}/>}>
                        <Route path="/" element={<Home/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/control-panel" element={<AdminControlPanel/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/control-panel/certificates" element={<AdminCertificatesPage/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/control-panel/tags" element={<AdminTagsPage/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/control-panel/orders" element={<AdminOrdersPage/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST"]}/>}>
                        <Route path="/activate-account" element={<ActivateAccount/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST", "USER", "ADMIN"]}/>}>
                        <Route path="/certificate/:certificateId" element={<CertificateDetails/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST"]}/>}>
                        <Route path="/login" element={<Login/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["GUEST"]}/>}>
                        <Route path="/register" element={<Register/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN", "USER"]}/>}>
                        <Route path="/profile/:id" element={<UserProfile/>}/>
                    </Route>

                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/create-tag" element={<TagCreation/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["ADMIN"]}/>}>
                        <Route path="/create-certificate" element={<CertificateCreation/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["USER"]}/>}>
                        <Route path="/checkout" element={<Checkout/>}/>
                    </Route>
                    <Route element={<Auth allowedRoles={["USER"]}/>}>
                        <Route path="/profile/orders" element={<OrderList/>}/>
                    </Route>
                    <Route path="*" element={<Error/>}/>
                </Routes>
            </main>
            <Footer/>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                limit={2}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"/>
        </Provider>
    );
}

export default App;