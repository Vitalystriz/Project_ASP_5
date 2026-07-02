

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { ThemeContext } from '../utils/ThemeContext';
import { getItem } from '../utils/storage';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function Product({ route, navigation }) {
    const { restaurantId, id } = route.params;
    const { isDark } = useContext(ThemeContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [targetUserId, setTargetUserId] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const loadUserId = async () => {
            const userStr = await getItem('user');
            if (userStr) {
                setTargetUserId(JSON.parse(userStr)?.id);
            }
        };
        loadUserId();
    }, []);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/products/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': String(targetUserId || '')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            } else {
                const allLocalProducts = await getItem('local_products');
                if (allLocalProducts) {
                    const parsed = JSON.parse(allLocalProducts);
                    const found = parsed.find(p => p._id === id || p.id === id);
                    if (found) {
                        setProduct(found);
                        return;
                    }
                }
                throw new Error('Product not found');
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantId && id && targetUserId) {
            fetchProductData();
        }
    }, [restaurantId, id, targetUserId]);

    // Fetch recommendations
    useEffect(() => {
        const fetchRecommendationsData = async () => {
            if (!restaurantId || !id || !targetUserId || !product) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/products/${id}/recommendations`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': String(targetUserId || '')
                    }
                });

                if (response.ok) {
                    const payload = await response.json();
                    const recIds = payload.data || [];
                    
                    const recPromises = recIds.map(async (recId) => {
                        try {
                            const searchRes = await fetch(`${API_BASE_URL}/api/search/${recId}`);
                            if (searchRes.ok) {
                                const searchData = await searchRes.json();
                                if (searchData.products && searchData.products.length > 0) {
                                    return searchData.products.find(p => p.id === recId || p._id === recId);
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching recommendation details for product ID ${recId}:`, err);
                        }
                        return null;
                    });
                    
                    const resolvedRecs = await Promise.all(recPromises);
                    setRecommendations(resolvedRecs.filter(p => p !== null && p !== undefined));
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            }
        };

        fetchRecommendationsData();
    }, [restaurantId, id, targetUserId, product]);

    const handleAddToCartClick = async () => {
        if (!product) {
            Alert.alert('Error', 'Could not add item to order.');
            return;
        }

        if (!targetUserId) {
            Alert.alert("Warning", "Please log in first to add items to your order.");
            return;
        }

        setAddingToCart(true);
        try {
            // Get all orders from backend to see if user has an active order
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': String(targetUserId || '')
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch existing orders');
            }

            const payload = await response.json();

            // Find an active order (status === "created" and userId === targetUserId)
            const activeOrder = payload.find(
                item => item.status === 'created' && item.userId === targetUserId
            );

            if (activeOrder) {
                // If there's an active order, we patch it
                let updatedProducts;
                if (activeOrder.restaurantId === restaurantId) {
                    // Same restaurant, merge products
                    const existingProductIndex = activeOrder.products.findIndex(
                        p => p.productId === id
                    );
                    if (existingProductIndex > -1) {
                        updatedProducts = activeOrder.products.map((p, idx) =>
                            idx === existingProductIndex ? { ...p, quantity: p.quantity + 1 } : p
                        );
                    } else {
                        updatedProducts = [...activeOrder.products, { productId: id, quantity: 1 }];
                    }
                } else {
                    // Different restaurant, overwrite restaurantId and reset products to this product
                    updatedProducts = [{ productId: id, quantity: 1 }];
                }

                const patchResponse = await fetch(`${API_BASE_URL}/api/orders/${activeOrder._id || activeOrder.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': String(targetUserId || '')
                    },
                    body: JSON.stringify({
                        restaurantId: restaurantId,
                        products: updatedProducts
                    })
                });

                if (patchResponse.ok) {
                    Alert.alert("Added to Cart", `${product.name} added to order! 🛒`);
                } else {
                    const errorData = await patchResponse.json();
                    Alert.alert("Error", `Failed to update order: ${errorData.error || 'Unknown error'}`);
                }
            } else {
                // Create a new order
                const createResponse = await fetch(`${API_BASE_URL}/api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': String(targetUserId || '')
                    },
                    body: JSON.stringify({
                        restaurantId: restaurantId,
                        products: [{ productId: id, quantity: 1 }]
                    })
                });

                if (createResponse.ok) {
                    Alert.alert("Added to Cart", `${product.name} added to order! 🛒`);
                } else {
                    const errorData = await createResponse.json();
                    Alert.alert("Error", `Failed to create order: ${errorData.error || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error adding product to order:', error);
            Alert.alert("Error", `Error adding item to order: ${error.message}`);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading && !product) {
        return (
            <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
                <Navbar />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00c2e8" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || !product) {
        return (
            <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
                <Navbar />
                <View style={styles.centerContainer}>
                    <Text style={[styles.errorText, isDark ? styles.textLight : styles.textDark]}>
                        Product not found 😕
                    </Text>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>

                <View style={[styles.detailsCard, isDark ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.productName, isDark ? styles.textLight : styles.textDark]}>
                        {product.name}
                    </Text>
                    
                    {product.type ? (
                        <View style={styles.tagContainer}>
                            <Text style={styles.tagText}>{product.type}</Text>
                        </View>
                    ) : null}

                    {product.description ? (
                        <Text style={[styles.description, isDark ? styles.textLight : styles.textDark]}>
                            {product.description}
                        </Text>
                    ) : null}

                    <Text style={styles.price}>₪{product.price}</Text>

                    <TouchableOpacity 
                        style={styles.addBtn} 
                        onPress={handleAddToCartClick}
                        disabled={addingToCart}
                    >
                        <Text style={styles.addBtnText}>
                            {addingToCart ? 'Adding...' : 'Add to cart+'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {recommendations.length > 0 ? (
                    <View style={styles.recommendationsSection}>
                        <Text style={[styles.recommendationsTitle, isDark ? styles.textLight : styles.textDark]}>
                            Recommended for You
                        </Text>
                        <FlatList
                            data={recommendations}
                            keyExtractor={(item) => item.id || item._id}
                            renderItem={({ item }) => (
                                <ProductCard item={item} restaurantId={item.restaurantId || restaurantId} />
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    bgLight: {
        backgroundColor: '#f8f9fa',
    },
    bgDark: {
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    backBtn: {
        backgroundColor: '#f1f3f4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    backBtnText: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 13,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        marginBottom: 16,
    },
    detailsCard: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 24,
    },
    cardLight: {
        backgroundColor: '#ffffff',
        borderColor: '#e8ecef',
    },
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2d2d2d',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e8f0fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 12,
    },
    tagText: {
        fontSize: 12,
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 16,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 20,
    },
    addBtn: {
        backgroundColor: '#00c2e8',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendationsSection: {
        marginTop: 10,
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    textLight: {
        color: '#ffffff',
    },
    textDark: {
        color: '#333333',
    },
});
