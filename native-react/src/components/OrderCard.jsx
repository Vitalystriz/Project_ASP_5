import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { cardStyles } from '../styles/OrderCard.styles';

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

const OrderItem = ({ restaurantId, userId, product, onPriceReport, onUpdateRequired, onQuantityUpdate, onItemRemoval }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [isMutating, setIsMutating] = useState(false);
    const reportedPriceRef = useRef(0);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        const syncProductMetadata = async () => {
            if (!restaurantId || !product.productId || !userId) return;

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/restaurants/${restaurantId}/products/${product.productId}`,
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
            <View style={[cardStyles.itemRow, isDark && cardStyles.itemRowDark, { opacity: 0.6 }]}>
                <Text style={[cardStyles.syncingText, isDark && cardStyles.textDark]}>Syncing item details...</Text>
            </View>
        );
    }

    return (
        <View style={[cardStyles.itemRow, isDark && cardStyles.itemRowDark, { opacity: isMutating ? 0.6 : 1 }]}>
            <View style={cardStyles.itemMeta}>
                <View style={[cardStyles.imgPlaceholder, isDark && cardStyles.imgPlaceholderDark]}>
                    <Text style={cardStyles.imgText}>🍔</Text>
                </View>
                <View style={cardStyles.itemDetails}>
                    <Text style={[cardStyles.itemName, isDark && cardStyles.textDark]}>{productDetails.name}</Text>
                    <Text style={[cardStyles.itemDesc, isDark && cardStyles.textMutedDark]}>{productDetails.description}</Text>
                    <Text style={[cardStyles.priceLabel, isDark && cardStyles.textMutedDark]}>Price: {productDetails.price} ILS</Text>
                </View>
            </View>

            <View style={[cardStyles.controlsRow, isDark && cardStyles.controlsRowDark]}>
                <View style={cardStyles.qtySelector}>
                    <TouchableOpacity 
                        style={[cardStyles.qtyBtn, isDark && cardStyles.qtyBtnDark]} 
                        onPress={() => handleQuantityUpdate(product.quantity - 1)} 
                        disabled={isMutating}
                    >
                        <Text style={[cardStyles.qtyBtnText, isDark && cardStyles.textDark]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[cardStyles.qtyText, isDark && cardStyles.textDark]}>
                        Qty: <Text style={cardStyles.qtyVal}>{product.quantity}</Text>
                    </Text>
                    <TouchableOpacity 
                        style={[cardStyles.qtyBtn, isDark && cardStyles.qtyBtnDark]} 
                        onPress={() => handleQuantityUpdate(product.quantity + 1)} 
                        disabled={isMutating}
                    >
                        <Text style={[cardStyles.qtyBtnText, isDark && cardStyles.textDark]}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={cardStyles.subtotalSection}>
                    <Text style={[cardStyles.subtotalLbl, isDark && cardStyles.textMutedDark]}>Subtotal:</Text>
                    <Text style={cardStyles.subtotalVal}>{(productDetails.price * product.quantity).toFixed(2)} ILS</Text>
                </View>

                <TouchableOpacity
                    onPress={handleItemRemoval}
                    disabled={isMutating}
                    style={cardStyles.removeBtn}
                >
                    <Text style={cardStyles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
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
                const response = await fetch(`${API_BASE_URL}/api/orders/${order._id || order.id}`, {
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
            const response = await fetch(`${API_BASE_URL}/api/orders/${order._id || order.id}`, {
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

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={[cardStyles.card, isDark && cardStyles.cardDark]}>
            <View style={[cardStyles.cardHeader, isDark && cardStyles.cardHeaderDark]}>
                <Text style={[cardStyles.cardTitle, isDark && cardStyles.cardTitleDark]}>Active Checkout Invoice</Text>
            </View>

            {order.products && order.products.map(product => (
                <OrderItem
                    key={product.productId}
                    orderId={order._id || order.id}
                    restaurantId={order.restaurantId}
                    userId={order.userId}
                    product={product}
                    onPriceReport={handleLocalPriceReport}
                    onUpdateRequired={onUpdateRequired}
                    onQuantityUpdate={handleQuantityUpdate}
                    onItemRemoval={handleItemRemoval}
                />
            ))}
        </View>
    );
}
