import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { ThemeContext } from '../utils/ThemeContext';
import { getItem } from '../utils/storage';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function Restaurant({ route, navigation }) {
    const { id } = route.params;
    const { isDark } = useContext(ThemeContext);

    const [restaurant, setRestaurant] = useState(null);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [targetUserId, setTargetUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        const loadUserId = async () => {
            const userStr = await getItem('user');
            if (userStr) {
                setTargetUserId(JSON.parse(userStr)?.id);
            }
        };
        loadUserId();
    }, []);

    const fetchRestaurantData = async () => {
        try {
            setLoading(true);

            // Fetch restaurant metadata
            const resResponse = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
            let restaurantData;
            if (resResponse.ok) {
                restaurantData = await resResponse.json();
            } else {
                restaurantData = { _id: id, id: id, name: 'Restaurant Menu', description: '', x: 0, y: 0 };
            }

            // Fetch restaurant menu products
            const productsResponse = await fetch(`${API_BASE_URL}/api/restaurants/${id}/products`);
            let productsData = [];

            if (productsResponse.ok) {
                const prodData = await productsResponse.json();
                productsData = Array.isArray(prodData) ? prodData : (prodData.data || []);
            }

            const completeData = {
                ...restaurantData,
                menu: productsData
            };

            setRestaurant(completeData);
            setFilteredMenu(productsData);
        } catch (err) {
            console.error('Error fetching data from server:', err);
            setRestaurant({ _id: id, id: id, name: 'Restaurant Menu', description: '', x: 0, y: 0, menu: [] });
            setFilteredMenu([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchRestaurantData();
        }
    }, [id]);

    // Handle search menu filtering
    useEffect(() => {
        if (!restaurant || !restaurant.menu) return;

        const lowerCaseSearch = (searchTerm || '').toLowerCase().trim();
        if (!lowerCaseSearch) {
            setFilteredMenu(restaurant.menu);
        } else {
            const filtered = restaurant.menu.filter(item =>
                (item.name && item.name.toLowerCase().includes(lowerCaseSearch)) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseSearch)) ||
                (item.type && item.type.toLowerCase().includes(lowerCaseSearch))
            );
            setFilteredMenu(filtered);
        }
    }, [searchTerm, restaurant]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddProduct = async () => {
        if (!formData.name || !formData.price) {
            Alert.alert("Error", "Please fill in at least Product Name and Price!");
            return;
        }

        const fallbackProdId = 'prod_' + Date.now().toString();
        const localProductBackup = {
            _id: fallbackProdId,
            id: fallbackProdId,
            restaurantId: id,
            name: formData.name,
            type: formData.type,
            price: Number(formData.price),
            description: formData.description
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}/products`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'user-id': String(targetUserId || '')
                },
                body: JSON.stringify({ ...localProductBackup, id: undefined, _id: undefined })
            });

            if (response.ok) {
                const data = await response.json();
                const savedProduct = data._id || data.id ? data : (data.data || localProductBackup);

                setRestaurant(prev => {
                    const updatedMenu = prev && prev.menu ? [...prev.menu, savedProduct] : [savedProduct];
                    return { ...prev, menu: updatedMenu };
                });
                Alert.alert("Success", "Product added successfully!");
            } else {
                setRestaurant(prev => {
                    const updatedMenu = prev && prev.menu ? [...prev.menu, localProductBackup] : [localProductBackup];
                    return { ...prev, menu: updatedMenu };
                });
                Alert.alert("Saved Locally", "Saved product locally (server returned status error).");
            }
        } catch (err) {
            console.error('Error saving product:', err);
            setRestaurant(prev => {
                const updatedMenu = prev && prev.menu ? [...prev.menu, localProductBackup] : [localProductBackup];
                return { ...prev, menu: updatedMenu };
            });
            Alert.alert("Saved Locally", "Saved product locally (offline).");
        } finally {
            setFormData({ name: '', type: '', price: '', description: '' });
            setIsModalOpen(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />

            <View style={styles.headerRow}>
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Restaurants')}>
                        <Text style={styles.backBtnText}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backBtn, styles.addProductBtn]} onPress={() => setIsModalOpen(true)}>
                        <Text style={styles.addProductBtnText}>+ Add Product</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]} numberOfLines={1}>
                    {restaurant?.name || 'Restaurant Menu'}
                </Text>
            </View>

            {restaurant?.description ? (
                <Text style={[styles.description, isDark ? styles.textLight : styles.textDark]}>
                    {restaurant.description}
                </Text>
            ) : null}
            
            {restaurant?.x !== undefined && restaurant?.y !== undefined ? (
                <Text style={[styles.coords, isDark ? styles.textMutedLight : styles.textMutedDark]}>
                    📍 Coordinates: ({restaurant.x}, {restaurant.y})
                </Text>
            ) : null}

            <View style={styles.searchContainer}>
                <SearchBar 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                    placeholder="Search for dishes or drinks..." 
                />
            </View>

            {loading && !restaurant ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00c2e8" />
                </View>
            ) : (
                <FlatList
                    data={filteredMenu}
                    keyExtractor={(item) => item.id || item._id}
                    renderItem={({ item }) => (
                        <ProductCard item={item} restaurantId={id} />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, isDark ? styles.textLight : styles.textDark]}>
                            No products found 😕
                        </Text>
                    }
                />
            )}

            {/* Add Product Modal */}
            <Modal
                visible={isModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDark ? styles.modalContentDark : styles.modalContentLight]}>
                        <Text style={[styles.modalTitle, isDark ? styles.textLight : styles.textDark]}>
                            Add New Product
                        </Text>
                        
                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Product Name *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.name}
                                onChangeText={(val) => handleInputChange('name', val)}
                            />
                        </View>

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Category / Type</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.type}
                                onChangeText={(val) => handleInputChange('type', val)}
                            />
                        </View>

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Price (ILS) *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.price}
                                onChangeText={(val) => handleInputChange('price', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Description</Text>
                            <TextInput 
                                style={[styles.modalInput, styles.textArea, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.description}
                                onChangeText={(val) => handleInputChange('description', val)}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalOpen(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddProduct}>
                                <Text style={styles.saveBtnText}>Save Product</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    headerRow: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    backBtn: {
        backgroundColor: '#f1f3f4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    backBtnText: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 13,
    },
    addProductBtn: {
        backgroundColor: '#28526e',
    },
    addProductBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },
    description: {
        fontSize: 15,
        paddingHorizontal: 16,
        color: '#555555',
        marginBottom: 4,
    },
    coords: {
        fontSize: 13,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchContainer: {
        paddingHorizontal: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 16,
        padding: 24,
        maxHeight: '90%',
    },
    modalContentLight: {
        backgroundColor: '#ffffff',
    },
    modalContentDark: {
        backgroundColor: '#1e1e1e',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalFormGroup: {
        marginBottom: 12,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        fontSize: 15,
    },
    modalInputLight: {
        borderColor: '#cccccc',
        backgroundColor: '#ffffff',
        color: '#333333',
    },
    modalInputDark: {
        borderColor: '#444444',
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
    },
    textArea: {
        height: 70,
        textAlignVertical: 'top',
        paddingVertical: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    cancelBtnText: {
        color: '#333333',
        fontWeight: 'bold',
    },
    saveBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#28a745',
    },
    saveBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    textLight: {
        color: '#ffffff',
    },
    textDark: {
        color: '#333333',
    },
    textMutedLight: {
        color: '#aaaaaa',
    },
    textMutedDark: {
        color: '#666666',
    },
});
