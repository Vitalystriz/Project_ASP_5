import React, { useState, useEffect, useRef } from 'react';
import OrderCard from '../components/OrderHistoryCard';
import '../styles/Order.css';

export default function HistoryOrdersPage() {
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCartCost, setTotalCartCost] = useState(0);
    const itemPricesRef = useRef({});

    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const targetUserId = parsedUser?._id || parsedUser?.id;
    console.log(targetUserId)

    const fetchActiveCartData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': targetUserId
                }
            });

            if (response.ok) {
                const payload = await response.json();

                const activeItems = payload.filter(
                    item => item.status === 'in service' && item.userId === targetUserId
                );

                if (activeItems.length > 0) {
                    setOrders(activeItems)
                } else {
                    setOrders(null);
                }
            }
        } catch (error) {
            console.error("Critical error downloading checkout payload:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveCartData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePriceReport = (orderId, productId, itemTotal) => {
        const key = `${orderId}-${productId}`;
        if (itemPricesRef.current[key] === itemTotal) return;
        itemPricesRef.current[key] = itemTotal;
        const sum = Object.values(itemPricesRef.current).reduce((acc, val) => acc + val, 0);
        setTotalCartCost(sum);
    };

    if (isLoading) return <div className="order-empty-message">Syncing cart details...</div>;

    return (
        <div className="order-page-container">
            <h2 className="order-page-title">Order History Terminal</h2>

            {!orders || orders.length === 0 ? (
                <p className="order-empty-message">Your history is empty.</p>
            ) : (
                <>
                    <div>
                        {orders.map((singleOrder) => (
                            <OrderCard
                                key={singleOrder._id || singleOrder.id}
                                order={singleOrder}
                                onPriceReport={handlePriceReport}
                            />
                        ))
                        }
                    </div>


                </>
            )}
        </div>
    );
}