import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import '../styles/Order.css';

export default function OrderPage() {
    const [latestOrder, setLatestOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productPrices, setProductPrices] = useState({});
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const targetUserId = JSON.parse(localStorage.getItem('user'))?.id;
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
                    item => item.status === 'created' && item.userId === targetUserId
                );

                if (activeItems.length > 0) {
                    const mostRecent = activeItems[activeItems.length - 1];
                    setLatestOrder(mostRecent);
                } else {
                    setLatestOrder(null);
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

    const handleCardPriceReport = (productId, itemTotal) => {
        setProductPrices(prev => ({
            ...prev,
            [productId]: itemTotal
        }));
    };

    const totalCartCost = latestOrder && latestOrder.products
        ? latestOrder.products.reduce((sum, p) => sum + (productPrices[p.productId] || 0), 0)
        : 0;

    const executeFinalCheckout = async () => {
        if (!latestOrder) return;
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${latestOrder._id || latestOrder.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': targetUserId
                },
                body: JSON.stringify({
                    status: "in service"
                })
            });

            if (response.ok) {
                setIsOrderPlaced(true);
            }
        } catch (error) {
            console.error("Checkout validation failure:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="order-empty-message">Syncing cart details...</div>;

    if (isOrderPlaced) {
        return (
            <div className="order-page-container">
                <div className="order-success-container">
                    <div className="order-success-icon">✓</div>
                    <h2 className="order-success-title">Success!</h2>
                    <p className="order-success-text">Your order has been received.</p>
                    <p className="order-success-subtext">The kitchen is currently processing your transaction payload.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-page-container">
            <h2 className="order-page-title">Shopping Cart Terminal</h2>

            {!latestOrder ? (
                <p className="order-empty-message">Your active basket is empty.</p>
            ) : (
                <>
                    <div>
                        <OrderCard
                            key={latestOrder._id || latestOrder.id}
                            order={latestOrder}
                            onPriceReport={handleCardPriceReport}
                            onUpdateRequired={fetchActiveCartData}
                        />
                    </div>

                    <div className="order-summary-box">
                        <h3 className="order-summary-total">
                            Aggregate Total: <span className="order-summary-total-val">{totalCartCost.toFixed(2)} ILS</span>
                        </h3>
                        <button
                            onClick={executeFinalCheckout}
                            className="order-checkout-btn"
                        >
                            Confirm & Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}