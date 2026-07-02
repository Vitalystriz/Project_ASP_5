import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../utils/ThemeContext';
import logo from '../../assets/Volt_Logo.png';

export default function Welcome() {
    const { isDark } = useContext(ThemeContext);

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
                <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
                    Welcome to Volt!
                </Text>
                <Text style={[styles.subtitle, isDark ? styles.textMutedLight : styles.textMutedDark]}>
                    World's best delivery app
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    bgLight: {
        backgroundColor: '#ffffff',
    },
    bgDark: {
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    textLight: {
        color: '#ffffff',
    },
    textDark: {
        color: '#28526e',
    },
    textMutedLight: {
        color: '#aaaaaa',
    },
    textMutedDark: {
        color: '#5f6368',
    },
});
