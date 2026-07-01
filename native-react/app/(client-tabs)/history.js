import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, useColorScheme } from 'react-native';
import OrderHistoryCard from '../../src/components/OrderHistoryCard';
import { pageStyles } from '../../src/styles/OrderPage.styles';
import { useUser } from '../../src/context/UserContext'; 
import { BASE_URL } from '../../config';

export default function HistoryScreen() {
    const { user } = useUser(); 
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCartCost, setTotalCartCost] = useState(0);
    const itemPricesRef = useRef({});

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const fetchHistoryData = async () => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id 
                }
            });

            if (response.ok) {
                const payload = await response.json();

                const historyItems = payload.filter(
                    item => item.status === 'in service' && item.userId === user.id
                );

                if (historyItems.length > 0) {
                    setOrders(historyItems);
                } else {
                    setOrders(null);
                }
            }
        } catch (error) {
            console.error("Critical error downloading history payload:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, [user]);

    const handlePriceReport = (orderId, productId, itemTotal) => {
        const key = `${orderId}-${productId}`;
        if (itemPricesRef.current[key] === itemTotal) return;
        itemPricesRef.current[key] = itemTotal;
        const sum = Object.values(itemPricesRef.current).reduce((acc, val) => acc + val, 0);
        setTotalCartCost(sum);
    };

    if (isLoading) {
        return (
            <View style={[pageStyles.centerContainer, isDark && pageStyles.bgDark]}>
                <ActivityIndicator size="large" color="#28a745" />
                <Text style={[pageStyles.loadingText, isDark && pageStyles.textDark]}>Syncing history details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[pageStyles.container, isDark && pageStyles.bgDark]} contentContainerStyle={pageStyles.contentContainer}>
            <Text style={[pageStyles.pageTitle, isDark && pageStyles.pageTitleDark]}>Order History Terminal</Text>

            {!orders || orders.length === 0 ? (
                <Text style={[pageStyles.emptyMessage, isDark && pageStyles.textMutedDark]}>Your history is empty.</Text>
            ) : (
                <View>
                    {orders.map((singleOrder) => (
                        <OrderHistoryCard
                            key={singleOrder._id || singleOrder.id}
                            order={singleOrder}
                            onPriceReport={handlePriceReport}
                        />
                    ))}
                </View>
            )}
        </ScrollView>
    );
}