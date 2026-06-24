import React, { useState, useEffect, useRef } from 'react';
import '../styles/Order.css';

const OrderHistoryItem = ({ restaurantId, userId, product, onPriceReport }) => {
    const [productDetails, setProductDetails] = useState(null);
    const reportedPriceRef = useRef(0);

    useEffect(() => {
        const syncProductMetadata = async () => {
            if (!restaurantId || !product.productId || !userId) return;

            try {
                const response = await fetch(
                    `http://localhost:5000/api/restaurants/${restaurantId}/products/${product.productId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'user-id': userId
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setProductDetails(data);
                    const initialSubtotal = data.price * product.quantity;
                    reportedPriceRef.current = initialSubtotal;
                    onPriceReport(product.productId, initialSubtotal);
                }
            } catch (error) {
                console.error("Error connection to API:", error);
            }
        };

        syncProductMetadata();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurantId, product.productId, userId]);

    useEffect(() => {
        if (productDetails) {
            const currentSubtotal = productDetails.price * product.quantity;
            if (reportedPriceRef.current !== currentSubtotal) {
                reportedPriceRef.current = currentSubtotal;
                onPriceReport(product.productId, currentSubtotal);
            }
        }
    }, [product.quantity, productDetails, product.productId, onPriceReport]);

    if (!productDetails) {
        return (
            <div className="order-item-row" style={{ opacity: 0.6 }}>
                <span>sync...</span>
            </div>
        );
    }

    return (
        <div className="order-item-row">
            <div className="order-item-meta">
                <div className="order-item-img-placeholder">🍔</div>
                <div className="order-item-details">
                    <h5 className="order-item-name">{productDetails.name}</h5>
                    <p className="order-item-desc">{productDetails.description}</p>
                    <span className="order-item-price-label">Price: {productDetails.price} ILS</span>
                </div>
            </div>

            <div className="order-item-controls-row">
                <div className="order-qty-selector">
                    <span>Quantity: <strong>{product.quantity}</strong></span>
                </div>

                <div className="order-item-subtotal-section">
                    <div className="order-subtotal-lbl">Subtotal:</div>
                    <div className="order-history-subtotal-val">{(productDetails.price * product.quantity).toFixed(2)} ILS</div>
                </div>
            </div>
        </div>
    );
};

export default function OrderHistoryCard({ order, onPriceReport }) {
    return (
        <div className="order-history-card">
            <div className="order-card-header">
                <h4 className="order-card-title">Handling order</h4>
                <span className="order-status-badge">
                    {order.status}
                </span>
            </div>



            {order.products && order.products.map(product => (
                <OrderHistoryItem
                    key={product.productId}
                    restaurantId={order.restaurantId}
                    userId={order.userId}
                    product={product}
                    onPriceReport={(prodId, itemTotal) => onPriceReport(prodId, itemTotal)}
                />
            ))}
        </div>
    );
}