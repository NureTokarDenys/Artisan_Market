import { useEffect, useState } from "react";
import "./SellerOrdersTableRow.css";
import { Loader } from "./Loader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const OrderRow = ({ order }) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const isoString = order.createdAt; 
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const orderDate = `${day}/${month}/${year}`;

    const [orderBuyer, setOrderBuyer] = useState(null);
    const [isLoadingBuyer, setIsLoadingBuyer] = useState(true);

    useEffect(() => {
        const getUsername = async () => {
            const response = await axiosPrivate.get(`/api/userinfo/${order.buyerId}`);
            setOrderBuyer(response.data.username);
            setIsLoadingBuyer(false);
        }
        getUsername();

    }, []);

    const shortOrderId = order.orderId.slice(-8);

    const OrderTotalPrice = order.products.reduce((total, product) => total + product.price, 0).toFixed(2);

    const getStatusClass = (status) => {
        switch (status) {
        case "In progress":
            return "order-row-status-pending";
        case "Completed":
            return "order-row-status-completed";
        case "Cancelled":
            return "order-row-status-canceled";
        default:
            return "";
        }
    };

    const handleViewDetails = () => {
        navigate(`/myorders/${order.orderId}`);
    }

    return (
        <tr className="order-row" onClick={handleViewDetails}>
        <td>#{shortOrderId}</td>
        <td>{orderDate}</td>
        <td className="lc">
        {isLoadingBuyer ? <>
                            <Loader className="buyer-loader" size="sm" color="green" />
                        </> : <>
                            {orderBuyer}
                        </>
                    }

        </td>
        <td>${OrderTotalPrice}</td>
        <td className={getStatusClass(order.status)}>{order.status}</td>
        </tr>
    );
};

export default OrderRow;
