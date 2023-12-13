import React from 'react';
import {Order} from '../../../utils/types';
import {Button} from "reactstrap";
import {formatDate} from "../../../utils/dateUtils";
import {useNavigate} from "react-router-dom";

interface OrdersTableProps {
    orders: Order[],
}

const OrdersTable: React.FC<OrdersTableProps> = ({orders}) => {
        const navigate = useNavigate()
        return (
            <>
                <table className="table">
                    <thead>
                    <tr className="text-center">
                        <th scope="col">Id</th>
                        <th scope="col">Description</th>
                        <th scope="col">Date</th>
                        <th scope="col">Positions</th>
                        <th scope="col">Cost</th>
                        <th scope="col">Actions</th>

                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="text-center align-content-center">
                            <td>{order.id}</td>

                            <td>{order.description}</td>
                            <td>{formatDate(order.createDate)}</td>
                            <td>{order.purchaseCertificates.map(
                                (orderPosition) => orderPosition.quantity + " x " + orderPosition.certificate.name).join(", ")}
                            </td>
                            <td>{order.cost}$</td>
                            <td>
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    <Button className="btn-dark"
                                            onClick={() => navigate("/profile/" + order.userId)}>User</Button>
                                </div>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>

            </>
        );
    }
;

export default OrdersTable;
