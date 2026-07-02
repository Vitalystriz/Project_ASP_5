import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getItem, removeItem } from '../utils/storage';
import { ThemeContext } from '../utils/ThemeContext';
import logo from '../../assets/Volt_Logo.png';

export default function Navbar() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { theme, isDark, toggleTheme } = useContext(ThemeContext);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ name: '', avatar: '' });
    const [userX, setUserX] = useState(0);
    const [userY, setUserY] = useState(0);

    useEffect(() => {
        const syncUserData = async () => {
            try {
                const token = await getItem('token');
                const userString = await getItem('user');

                setIsLoggedIn(!!token);

                if (token && userString) {
                    const user = JSON.parse(userString);
                    const base = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
                    const avatar = user.profilePic 
                        ? `${base}/uploads/${user.profilePic}` 
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

                    setUserData({
                        name: user.displayName || user.username || 'User',
                        avatar: avatar
                    });

                    if (user.x !== undefined && user.y !== undefined) {
                        setUserX(user.x);
                        setUserY(user.y);
                    }
                }
            } catch (e) {
                console.error("Error parsing user data in Navbar:", e);
            }
        };

        if (isFocused) {
            syncUserData();
        }
    }, [isFocused]);

    const handleLogout = async () => {
        await removeItem('token');
        await removeItem('user');
        setIsLoggedIn(false);
        navigation.navigate('Login');
    };

    return (
        <View style={[styles.navbar, isDark ? styles.navbarDark : styles.navbarLight]}>
            {/* Top row: Logo and User Info */}
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </TouchableOpacity>

                {isLoggedIn ? (
                    <View style={styles.userInfo}>
                        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
                        <Text style={[styles.username, isDark ? styles.textLight : styles.textDark]}>{userData.name}</Text>
                    </View>
                ) : (
                    <View style={styles.authButtons}>
                        <TouchableOpacity style={styles.smallBtn} onPress={() => { console.log('[DEBUG] Navbar: clicked Login'); navigation.navigate('Login'); }}>
                            <Text style={styles.smallBtnText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, styles.btnSuccess]} onPress={() => { console.log('[DEBUG] Navbar: clicked Sign Up'); navigation.navigate('Register'); }}>
                            <Text style={styles.smallBtnText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Coordinates, Theme Toggle and Logout */}
            {isLoggedIn && (
                <View style={styles.middleRow}>
                    <View style={styles.coordinatesContainer}>
                        <Text style={styles.coordIcon}>📍</Text>
                        <Text style={[styles.coordText, isDark ? styles.textMutedLight : styles.textMutedDark]}>
                            X: {userX}, Y: {userY}
                        </Text>
                    </View>

                    <View style={styles.controlsRight}>
                        <TouchableOpacity style={styles.actionIconBtn} onPress={toggleTheme}>
                            <Text style={styles.actionIconText}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionIconBtn, styles.btnLogout]} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Navigation links (only when logged in) */}
            {isLoggedIn && (
                <View style={styles.navLinksRow}>
                    <TouchableOpacity style={styles.navLink} onPress={() => navigation.navigate('Restaurants')}>
                        <Text style={[styles.navLinkText, isDark ? styles.textLight : styles.textDark]}>Restaurants</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navLink, styles.navLinkCart]} onPress={() => navigation.navigate('ActiveCart')}>
                        <Text style={styles.cartLinkText}>🛒 Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navLink} onPress={() => navigation.navigate('OrderHistory')}>
                        <Text style={[styles.navLinkText, isDark ? styles.textLight : styles.textDark]}>History</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 12 : 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        width: '100%',
    },
    navbarLight: {
        backgroundColor: '#ffffff',
        borderBottomColor: '#e0e0e0',
    },
    navbarDark: {
        backgroundColor: '#1a1a1a',
        borderBottomColor: '#2d2d2d',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 35,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#ccc',
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    authButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    smallBtn: {
        backgroundColor: '#28526e',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    btnSuccess: {
        backgroundColor: '#28a745',
    },
    smallBtnText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    middleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cccccc',
    },
    coordinatesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coordIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    coordText: {
        fontSize: 12,
        fontWeight: '600',
    },
    controlsRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionIconBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    actionIconText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333333',
    },
    btnLogout: {
        backgroundColor: '#dc3545',
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    navLinksRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#cccccc',
    },
    navLink: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    navLinkText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    navLinkCart: {
        borderWidth: 1,
        borderColor: '#00c2e8',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    cartLinkText: {
        color: '#00c2e8',
        fontSize: 14,
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
