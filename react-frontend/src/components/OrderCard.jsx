import React, { useState, useEffect, useRef } from 'react';
import '../styles/Order.css';

const OrderItem = ({ orderId, restaurantId, userId, product, onPriceReport, onUpdateRequired, onQuantityUpdate, onItemRemoval }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [isMutating, setIsMutating] = useState(false);
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
                console.error(error);
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

    const handleQuantityUpdate = async (newQuantity) => {
        setIsMutating(true);
        try {
            await onQuantityUpdate(product.productId, newQuantity);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMutating(false);
        }
    };

    const handleItemRemoval = async () => {
        setIsMutating(true);
        try {
            await onItemRemoval(product.productId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsMutating(false);
        }
    };

    if (!productDetails) {
        return (
            <div className="order-item-row" style={{ opacity: 0.6 }}>
                <span>Syncing item details...</span>
            </div>
        );
    }

    return (
        <div className="order-item-row" style={{ opacity: isMutating ? 0.6 : 1 }}>
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
                    <button 
                        className="order-qty-btn" 
                        onClick={() => handleQuantityUpdate(product.quantity - 1)} 
                        disabled={isMutating}
                    >-</button>
                    <span>Qty: <strong>{product.quantity}</strong></span>
                    <button 
                        className="order-qty-btn" 
                        onClick={() => handleQuantityUpdate(product.quantity + 1)} 
                        disabled={isMutating}
                    >+</button>
                </div>

                <div className="order-item-subtotal-section">
                    <div className="order-subtotal-lbl">Subtotal:</div>
                    <div className="order-subtotal-val">{(productDetails.price * product.quantity).toFixed(2)} ILS</div>
                </div>

                <button
                    onClick={handleItemRemoval}
                    disabled={isMutating}
                    className="order-item-remove-btn"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default function OrderCard({ order, onPriceReport, onUpdateRequired }) {
    const handleLocalPriceReport = (productId, itemTotal) => {
        onPriceReport(productId, itemTotal);
    };

    const handleQuantityUpdate = async (productId, newQuantity) => {
        if (!order || !order.products) return;

        let updatedProducts;
        if (newQuantity < 1) {
            updatedProducts = order.products.filter(p => p.productId !== productId);
        } else {
            updatedProducts = order.products.map(p =>
                p.productId === productId ? { ...p, quantity: newQuantity } : p
            );
        }

        if (updatedProducts.length === 0) {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                    method: 'DELETE',
                    headers: {
                        'user-id': order.userId
                    }
                });
                if (response.ok) {
                    onPriceReport(productId, 0);
                    onUpdateRequired();
                }
            } catch (error) {
                console.error("Error deleting empty order:", error);
            }
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': order.userId
                },
                body: JSON.stringify({
                    products: updatedProducts
                })
            });
            if (response.ok) {
                onUpdateRequired();
            }
        } catch (error) {
            console.error("Error updating order products:", error);
        }
    };

    const handleItemRemoval = async (productId) => {
        await handleQuantityUpdate(productId, 0);
    };

    return (
        <div className="order-card">
            <div className="order-card-header">
                <h4 className="order-card-title">Active Checkout Invoice</h4>
            </div>


            {order.products && order.products.map(product => (
                <OrderItem
                    key={product.productId}
                    orderId={order.id}
                    restaurantId={order.restaurantId}
                    userId={order.userId}
                    product={product}
                    onPriceReport={handleLocalPriceReport}
                    onUpdateRequired={onUpdateRequired}
                    onQuantityUpdate={handleQuantityUpdate}
                    onItemRemoval={handleItemRemoval}
                />
            ))}
        </div>
    );
}