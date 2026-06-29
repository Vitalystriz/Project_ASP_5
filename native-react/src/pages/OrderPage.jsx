import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, useColorScheme } from 'react-native';
import OrderCard from '../components/OrderCard';
import { getItem } from '../utils/storage';
import { pageStyles } from '../styles/OrderPage.styles';

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

export default function OrderPage({ route }) {
    const [targetUserId, setTargetUserId] = useState(null);
    const [latestOrder, setLatestOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productPrices, setProductPrices] = useState({});
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fetchActiveCartData = async (userId) => {
        const activeUserId = userId || targetUserId;
        if (!activeUserId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': activeUserId
                }
            });

            if (response.ok) {
                const payload = await response.json();

                const activeItems = payload.filter(
                    item => item.status === 'created' && item.userId === activeUserId
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
        const initializePage = async () => {
            setIsLoading(true);
            let userId = route?.params?.userId || route?.params?.user?.id;
            
            if (!userId) {
                try {
                    const userStr = await getItem('user');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        userId = user?.id;
                    }
                } catch (e) {
                    console.error("Failed to parse user from storage", e);
                }
            }

            if (userId) {
                setTargetUserId(userId);
            }
            await fetchActiveCartData(userId);
        };

        initializePage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route?.params]);

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
        if (!latestOrder || !targetUserId) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${latestOrder._id || latestOrder.id}`, {
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

    if (isLoading) {
        return (
            <View style={[pageStyles.centerContainer, isDark && pageStyles.bgDark]}>
                <ActivityIndicator size="large" color="#00c2e8" />
                <Text style={[pageStyles.loadingText, isDark && pageStyles.textDark]}>Syncing cart details...</Text>
            </View>
        );
    }

    if (isOrderPlaced) {
        return (
            <View style={[pageStyles.container, isDark && pageStyles.bgDark]}>
                <View style={[pageStyles.successContainer, isDark && pageStyles.successContainerDark]}>
                    <Text style={pageStyles.successIcon}>✓</Text>
                    <Text style={pageStyles.successTitle}>Success!</Text>
                    <Text style={[pageStyles.successText, isDark && pageStyles.textDark]}>Your order has been received.</Text>
                    <Text style={[pageStyles.successSubtext, isDark && pageStyles.textMutedDark]}>
                        The kitchen is currently processing your transaction payload.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={[pageStyles.container, isDark && pageStyles.bgDark]} contentContainerStyle={pageStyles.contentContainer}>
            <Text style={[pageStyles.pageTitle, isDark && pageStyles.pageTitleDark]}>Shopping Cart Terminal</Text>

            {!latestOrder ? (
                <Text style={[pageStyles.emptyMessage, isDark && pageStyles.textMutedDark]}>Your active basket is empty.</Text>
            ) : (
                <>
                    <View>
                        <OrderCard
                            key={latestOrder._id || latestOrder.id}
                            order={latestOrder}
                            onPriceReport={handleCardPriceReport}
                            onUpdateRequired={() => fetchActiveCartData(targetUserId)}
                        />
                    </View>

                    <View style={[pageStyles.summaryBox, isDark && pageStyles.summaryBoxDark]}>
                        <Text style={[pageStyles.summaryTotal, isDark && pageStyles.summaryTotalDark]}>
                            Aggregate Total:{' '}
                            <Text style={pageStyles.summaryTotalVal}>{totalCartCost.toFixed(2)} ILS</Text>
                        </Text>
                        <TouchableOpacity
                            onPress={executeFinalCheckout}
                            style={pageStyles.checkoutBtn}
                        >
                            <Text style={pageStyles.checkoutBtnText}>Confirm & Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ScrollView>
    );
}
