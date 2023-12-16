import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {placeOrder} from "../../utils/userUtils";
import Loader from "../common/Loader";
import {getCartPositionsFromCookies, setCartPositionsToCookies} from "../../utils/cartUtils";
import CartPositionCard from "./CartPositionCard";
import {Button} from "reactstrap";
import {isAxiosError} from "axios";
import {CartPosition, OrderRequest} from "../../utils/types";
import {getDateDiffInDays} from "../../utils/certificateUtils";
import {toast} from "react-toastify";
import _ from "lodash";

const Checkout = () => {
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [cart, setCart] = useState<CartPosition[]>(getCartPositionsFromCookies())
    const navigate = useNavigate()
    useEffect(() => {
        if (cart.length < 1) {
            setError("Cart is empty")
        }
    }, [cart]);
    const handleSubmit = async () => {
        setError("")
        setIsLoading(true)

        try {
            const positions = getCartPositionsFromCookies()
                .filter((pos) => getDateDiffInDays(pos.durationDate) >= 0)
                .map((pos) => ({
                    certificateId: pos.certificateId,
                    quantity: pos.quantity
                }))
            if (positions.length == 0) {
                toast.info("You must add at least one available certificate")
            } else {
                const order: OrderRequest = {
                    description: "",
                    positions: positions
                }
                const data = await placeOrder(JSON.stringify(order))
                setCartPositionsToCookies(cart
                    .filter((pos) => getDateDiffInDays(pos.durationDate) < 0)
                )
                setSuccess(`Order #${data.id} Total cost: ${data.cost}$`)
            }
        } catch (e) {
            if (isAxiosError(e) && e.response)
                setError(e.response.data.detail)
        } finally {
            setIsLoading(false)
        }
    }

    return (success ? <section>
        <div className="alert alert-success p-3 d-flex flex-column align-items-center">
            <h1 className="alert-heading">Order placed!</h1>
            <hr/>
            <p>{success}</p>
            <Button className="btn btn-info" onClick={() => navigate("/")}>Go back</Button>
        </div>
    </section> : (isLoading ? <Loader/> :
            error ? <div className="alert alert-info"><h3>{error}</h3></div> :
                <div className="border-2  p-3 w-50 rounded-2 d-flex flex-column gap-3">
                    {cart.map((position: CartPosition) => (
                        <CartPositionCard position={position} key={position.certificateId}/>
                    ))}

                    <Button onClick={_.debounce(handleSubmit, 1000)}
                            className="align-self-end btn btn-success">Confirm</Button>
                </div>
    ));
}
export default Checkout;