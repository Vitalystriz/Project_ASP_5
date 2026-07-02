import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderHistoryCard from '../components/OrderHistoryCard';
import Navbar from '../components/Navbar';
import { getItem } from '../utils/storage';
import { ThemeContext } from '../utils/ThemeContext';
import { pageStyles } from '../styles/OrderPage.styles';

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
});

export default function HistoryOrdersPage({ route }) {
    const [targetUserId, setTargetUserId] = useState(null);
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCartCost, setTotalCartCost] = useState(0);
    const itemPricesRef = useRef({});

    const { isDark } = useContext(ThemeContext);

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
                    'user-id': String(activeUserId || '')
                }
            });

            if (response.ok) {
                const payload = await response.json();

                const activeItems = payload.filter(
                    item => item.status === 'in service' && item.userId === activeUserId
                );

                if (activeItems.length > 0) {
                    setOrders(activeItems);
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

    const handlePriceReport = (orderId, productId, itemTotal) => {
        const key = `${orderId}-${productId}`;
        if (itemPricesRef.current[key] === itemTotal) return;
        itemPricesRef.current[key] = itemTotal;
        const sum = Object.values(itemPricesRef.current).reduce((acc, val) => acc + val, 0);
        setTotalCartCost(sum);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[pageStyles.container, isDark && pageStyles.bgDark, { flex: 1 }]}>
                <Navbar />
                <View style={[pageStyles.centerContainer, isDark && pageStyles.bgDark]}>
                    <ActivityIndicator size="large" color="#28a745" />
                    <Text style={[pageStyles.loadingText, isDark && pageStyles.textDark]}>Syncing cart details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[pageStyles.container, isDark && pageStyles.bgDark, { flex: 1 }]}>
            <Navbar />
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
        </SafeAreaView>
    );
}
