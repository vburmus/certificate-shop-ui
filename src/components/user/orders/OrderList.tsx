import React, {useEffect, useState} from 'react';
import {getUserFromStorage} from "../../../utils/userUtils";
import {Order} from "../../../utils/types";
import {getUserOrders} from "../../../utils/orderUtils";
import OrderCard from "./OrderCard";
import {isAxiosError} from "axios";
import PaginationList from "../../common/PaginationList";
import {useLocation} from "react-router-dom";
import {PAGE, SIZE} from "../../../utils/constants";
import Loader from "../../common/Loader";

const OrderList = () => {
    const user = getUserFromStorage()
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0)
    const [totalElems, setTotalElems] = useState(0)
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get(PAGE);
    let currentPage = page ? parseInt(page) : 1
    const size = queryParams.get(SIZE);
    const currentSize = size ? parseInt(size) : 3;
    const getOrders = async () => {
        try {
            setIsLoading(true)
            if (user) {
                const response = await getUserOrders(user.id, currentPage, currentSize);
                const data = response.content
                setOrders(data)
                setTotalPages(response.totalPages)
                setTotalElems(response.totalElements)
            }
        } catch (e) {
            if (isAxiosError(e) && e.response)
                setError(e.response.data.detail)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        getOrders()
    }, []);
    useEffect(() => {
        getOrders()
    }, [currentPage, currentSize]);

    return (isLoading ? <Loader/> :
            error ? <div className="alert alert-info"><h3>{error}</h3></div> :
                <div className="border-2 p-3 rounded-2 d-flex flex-wrap gap-3 w-75 justify-content-center">
                    {orders.map((order: Order) => (
                        <OrderCard order={order} key={order.id}/>
                    ))}
                    <PaginationList totalPages={totalPages} currentPage={currentPage} currentSize={currentSize}
                                    totalElems={totalElems}/>
                </div>

    );
}
export default OrderList;