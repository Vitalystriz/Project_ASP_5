import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../utils/ThemeContext';

export default function RestaurantCard({ restaurant, isFavorite, onToggleFavorite }) {
    const navigation = useNavigation();
    const { isDark } = useContext(ThemeContext);

    const handleCardClick = () => {
        const id = restaurant.id || restaurant._id;
        navigation.navigate('Restaurant', { id });
    };

    const restId = restaurant.id || restaurant._id;

    return (
        <TouchableOpacity 
            style={[styles.card, isDark ? styles.cardDark : styles.cardLight]} 
            onPress={handleCardClick}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.name, isDark ? styles.textLight : styles.textDark]}>
                    {restaurant.name}
                </Text>
                <TouchableOpacity 
                    onPress={() => onToggleFavorite(restId)}
                    style={styles.favoriteButton}
                >
                    <Text style={styles.starText}>{isFavorite ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.type, isDark ? styles.textMutedLight : styles.textMutedDark]}>
                {restaurant.type}
            </Text>
            
            {restaurant.description ? (
                <Text style={[styles.description, isDark ? styles.textLight : styles.textDark]}>
                    {restaurant.description}
                </Text>
            ) : null}
            
            <Text style={[styles.address, isDark ? styles.textMutedLight : styles.textMutedDark]}>
                Coordinates: ({restaurant.x}, {restaurant.y})
            </Text>

            {restaurant.distance !== undefined ? (
                <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>🛵 {restaurant.distance} units away</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLight: {
        backgroundColor: '#ffffff',
        borderColor: '#e8ecef',
    },
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2d2d2d',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    favoriteButton: {
        padding: 4,
    },
    starText: {
        fontSize: 24,
    },
    type: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 4,
    },
    description: {
        fontSize: 14,
        marginVertical: 4,
        lineHeight: 18,
    },
    address: {
        fontSize: 12,
        marginTop: 6,
    },
    distanceContainer: {
        marginTop: 8,
    },
    distanceText: {
        fontWeight: 'bold',
        color: '#00c2e8',
        fontSize: 13,
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
