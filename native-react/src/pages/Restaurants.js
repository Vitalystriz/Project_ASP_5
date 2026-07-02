import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { ThemeContext } from '../utils/ThemeContext';
import { getItem, setItem } from '../utils/storage';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function Restaurants({ navigation }) {
    const { isDark } = useContext(ThemeContext);
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [userX, setUserX] = useState(null);
    const [userY, setUserY] = useState(null);
    const [targetUserId, setTargetUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        x: '',
        y: ''
    });

    // Load user data and favorites
    useEffect(() => {
        const initializeData = async () => {
            try {
                const userString = await getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);
                    setTargetUserId(user?.id);
                    if (user.x !== undefined && user.y !== undefined) {
                        setUserX(parseFloat(user.x));
                        setUserY(parseFloat(user.y));
                    }
                }

                const savedFavorites = await getItem('favorite_restaurants');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (e) {
                console.error("Error loading user or favorites data", e);
            }
        };
        initializeData();
    }, []);

    const sortRestaurants = (list, currentFavorites, ux = userX, uy = userY) => {
        let updatedList = list.map(restaurant => {
            const restX = parseFloat(restaurant.x) || 0;
            const restY = parseFloat(restaurant.y) || 0;
            let distance = undefined;
            
            if (ux !== null && uy !== null) {
                const calcDist = Math.sqrt(Math.pow(ux - restX, 2) + Math.pow(uy - restY, 2));
                distance = parseFloat(calcDist.toFixed(2));
            }
            return { ...restaurant, distance };
        });

        updatedList.sort((a, b) => {
            const idA = a.id || a._id;
            const idB = b.id || b._id;
            const isFavA = currentFavorites.includes(idA);
            const isFavB = currentFavorites.includes(idB);
            if (isFavA && !isFavB) return -1;
            if (!isFavA && isFavB) return 1;
            if (a.distance !== undefined && b.distance !== undefined) {
                return a.distance - b.distance;
            }
            return 0;
        });

        return updatedList;
    };

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(false);
            
            const response = await fetch(`${API_BASE_URL}/api/restaurants`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            const actualData = Array.isArray(data) ? data : (data.data || []);

            const sorted = sortRestaurants(actualData, favorites);
            setRestaurants(sorted);
            setFilteredRestaurants(sorted);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, [userX, userY, favorites.length]);

    // Handle Search filtering
    useEffect(() => {
        const lowerCaseSearch = (searchTerm || '').toLowerCase().trim();
        if (!lowerCaseSearch) {
            setFilteredRestaurants(restaurants);
        } else {
            const filtered = restaurants.filter(restaurant =>
                (restaurant.name && restaurant.name.toLowerCase().includes(lowerCaseSearch)) ||
                (restaurant.type && restaurant.type.toLowerCase().includes(lowerCaseSearch))
            );
            setFilteredRestaurants(filtered);
        }
    }, [searchTerm, restaurants]);

    const handleToggleFavorite = async (restaurantId) => {
        let updatedFavorites;
        if (favorites.includes(restaurantId)) {
            updatedFavorites = favorites.filter(id => id !== restaurantId);
        } else {
            updatedFavorites = [...favorites, restaurantId];
        }
        
        setFavorites(updatedFavorites);
        await setItem('favorite_restaurants', JSON.stringify(updatedFavorites));
        
        const resorted = sortRestaurants(restaurants, updatedFavorites);
        setRestaurants(resorted);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.type || formData.x === '' || formData.y === '') {
            Alert.alert("Error", "Please fill in Restaurant Name, Food Type and Coordinates!");
            return;
        }

        const fallbackId = 'res_' + Date.now().toString();
        const preparedData = {
            name: formData.name,
            type: formData.type,
            description: formData.description,
            x: parseFloat(formData.x),
            y: parseFloat(formData.y)
        };
        const localBackup = { _id: fallbackId, id: fallbackId, ...preparedData };

        try {
            const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': String(targetUserId || '')
                },
                body: JSON.stringify(preparedData)
            });

            if (response.ok) {
                const data = await response.json();
                const savedRestaurant = data._id || data.id ? data : (data.data || localBackup);
                const resorted = sortRestaurants([...restaurants, savedRestaurant], favorites);
                setRestaurants(resorted);
                Alert.alert("Success", "Restaurant created successfully!");
            } else {
                const resorted = sortRestaurants([...restaurants, localBackup], favorites);
                setRestaurants(resorted);
                Alert.alert("Saved Locally", "Saved restaurant locally (server returned status error).");
            }
        } catch (err) {
            console.error('Network/Server error during save:', err);
            const resorted = sortRestaurants([...restaurants, localBackup], favorites);
            setRestaurants(resorted);
            Alert.alert("Saved Locally", "Saved restaurant locally (offline).");
        } finally {
            setFormData({ name: '', type: '', description: '', x: '', y: '' });
            setIsModalOpen(false);
            setError(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />
            
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.createBtn} onPress={() => setIsModalOpen(true)}>
                    <Text style={styles.createBtnText}>+ Create Restaurant</Text>
                </TouchableOpacity>
                <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>Restaurant List</Text>
            </View>

            <View style={styles.searchContainer}>
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </View>

            {loading && restaurants.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#00c2e8" />
                </View>
            ) : (
                <FlatList
                    data={filteredRestaurants}
                    keyExtractor={(item) => item.id || item._id}
                    renderItem={({ item }) => (
                        <RestaurantCard
                            restaurant={item}
                            isFavorite={favorites.includes(item.id || item._id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, isDark ? styles.textLight : styles.textDark]}>
                            {error ? "Failed to load restaurants 😕" : "No restaurant found 😕"}
                        </Text>
                    }
                />
            )}

            {/* Create Restaurant Modal */}
            <Modal
                visible={isModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDark ? styles.modalContentDark : styles.modalContentLight]}>
                        <Text style={[styles.modalTitle, isDark ? styles.textLight : styles.textDark]}>
                            Create New Restaurant
                        </Text>
                        
                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Restaurant Name *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.name}
                                onChangeText={(val) => handleInputChange('name', val)}
                            />
                        </View>

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Food Type *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.type}
                                onChangeText={(val) => handleInputChange('type', val)}
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

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Coordinate X *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.x}
                                onChangeText={(val) => handleInputChange('x', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.modalFormGroup}>
                            <Text style={[styles.modalLabel, isDark ? styles.textLight : styles.textDark]}>Coordinate Y *</Text>
                            <TextInput 
                                style={[styles.modalInput, isDark ? styles.modalInputDark : styles.modalInputLight]}
                                value={formData.y}
                                onChangeText={(val) => handleInputChange('y', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalOpen(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                                <Text style={styles.saveBtnText}>Save Restaurant</Text>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    createBtn: {
        backgroundColor: '#28526e',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    createBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
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
});
