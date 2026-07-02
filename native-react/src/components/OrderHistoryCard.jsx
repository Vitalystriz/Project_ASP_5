import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, useColorScheme } from 'react-native';
import { historyCardStyles } from '../styles/OrderHistoryCard.styles';

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

const OrderHistoryItem = ({ restaurantId, userId, product, onPriceReport }) => {
    const [productDetails, setProductDetails] = useState(null);
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
                            'user-id': String(userId || '')
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
                console.error("Error connecting to API:", error);
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
            <View style={[historyCardStyles.itemRow, isDark && historyCardStyles.itemRowDark, { opacity: 0.6 }]}>
                <Text style={[historyCardStyles.syncingText, isDark && historyCardStyles.textDark]}>sync...</Text>
            </View>
        );
    }

    return (
        <View style={[historyCardStyles.itemRow, isDark && historyCardStyles.itemRowDark]}>
            <View style={historyCardStyles.itemMeta}>
                <View style={[historyCardStyles.imgPlaceholder, isDark && historyCardStyles.imgPlaceholderDark]}>
                    <Text style={historyCardStyles.imgText}>🍔</Text>
                </View>
                <View style={historyCardStyles.itemDetails}>
                    <Text style={[historyCardStyles.itemName, isDark && historyCardStyles.textDark]}>{productDetails.name}</Text>
                    <Text style={[historyCardStyles.itemDesc, isDark && historyCardStyles.textMutedDark]}>{productDetails.description}</Text>
                    <Text style={[historyCardStyles.priceLabel, isDark && historyCardStyles.textMutedDark]}>Price: {productDetails.price} ILS</Text>
                </View>
            </View>

            <View style={[historyCardStyles.controlsRow, isDark && historyCardStyles.controlsRowDark]}>
                <View style={historyCardStyles.qtySelector}>
                    <Text style={[historyCardStyles.qtyText, isDark && historyCardStyles.textDark]}>
                        Quantity: <Text style={historyCardStyles.qtyVal}>{product.quantity}</Text>
                    </Text>
                </View>

                <View style={historyCardStyles.subtotalSection}>
                    <Text style={[historyCardStyles.subtotalLbl, isDark && historyCardStyles.textMutedDark]}>Subtotal:</Text>
                    <Text style={historyCardStyles.historySubtotalVal}>{(productDetails.price * product.quantity).toFixed(2)} ILS</Text>
                </View>
            </View>
        </View>
    );
};

export default function OrderHistoryCard({ order, onPriceReport }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={[historyCardStyles.card, isDark && historyCardStyles.cardDark]}>
            <View style={[historyCardStyles.cardHeader, isDark && historyCardStyles.cardHeaderDark]}>
                <Text style={[historyCardStyles.cardTitle, isDark && historyCardStyles.cardTitleDark]}>Handling order</Text>
                <View style={historyCardStyles.statusBadge}>
                    <Text style={historyCardStyles.statusBadgeText}>{order.status}</Text>
                </View>
            </View>

            {order.products && order.products.map(product => (
                <OrderHistoryItem
                    key={product.productId}
                    restaurantId={order.restaurantId}
                    userId={order.userId}
                    product={product}
                    onPriceReport={(prodId, itemTotal) => onPriceReport(order._id || order.id, prodId, itemTotal)}
                />
            ))}
        </View>
    );
}
