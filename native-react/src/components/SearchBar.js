import React, { useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';

export default function SearchBar({ value, onChange, placeholder = "Looking for a specific restaurant/food type?" }) {
    const { isDark } = useContext(ThemeContext);

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <View style={[styles.wrapper, isDark ? styles.wrapperDark : styles.wrapperLight]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? '#888888' : '#aaaaaa'}
                    value={value || ''}
                    onChangeText={onChange}
                />
                {value ? (
                    <TouchableOpacity onPress={() => onChange('')} style={styles.clearButton}>
                        <Text style={[styles.clearText, isDark ? styles.textLight : styles.textDark]}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
    },
    containerLight: {
        backgroundColor: '#ffffff',
    },
    containerDark: {
        backgroundColor: '#1a1a1a',
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 44,
    },
    wrapperLight: {
        borderColor: '#cccccc',
        backgroundColor: '#f9f9f9',
    },
    wrapperDark: {
        borderColor: '#444444',
        backgroundColor: '#252525',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
    },
    inputLight: {
        color: '#333333',
    },
    inputDark: {
        color: '#ffffff',
    },
    clearButton: {
        padding: 6,
    },
    clearText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textLight: {
        color: '#aaaaaa',
    },
    textDark: {
        color: '#666666',
    },
});
