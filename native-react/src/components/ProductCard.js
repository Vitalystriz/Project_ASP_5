import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../utils/ThemeContext';

export default function ProductCard({ item, restaurantId }) {
    const navigation = useNavigation();
    const { isDark } = useContext(ThemeContext);

    const handleClick = () => {
        const rId = item.restaurantId || restaurantId;
        const productId = item.id || item._id;
        if (rId && productId) {
            navigation.navigate('Product', { restaurantId: rId, id: productId });
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.card, isDark ? styles.cardDark : styles.cardLight]} 
            onPress={handleClick}
            activeOpacity={0.8}
        >
            <View style={styles.infoContainer}>
                {item.type ? (
                    <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>{item.type}</Text>
                    </View>
                ) : null}
                <Text style={[styles.name, isDark ? styles.textLight : styles.textDark]}>{item.name}</Text>
                {item.description ? (
                    <Text style={[styles.description, isDark ? styles.textMutedLight : styles.textMutedDark]} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}
                <Text style={styles.price}>₪{item.price}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
    },
    cardLight: {
        backgroundColor: '#ffffff',
        borderColor: '#e8ecef',
    },
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2d2d2d',
    },
    infoContainer: {
        flexDirection: 'column',
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e8f0fe',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 11,
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        marginBottom: 8,
        lineHeight: 16,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#28a745',
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
