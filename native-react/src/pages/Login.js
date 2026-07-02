import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../utils/ThemeContext';
import { setItem } from '../utils/storage';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function Login({ navigation }) {
    const { isDark } = useContext(ThemeContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!username.trim() || !password) {
            return "Both username and password are required.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        return null;
    };

    const handleSubmit = async () => {
        console.log('[DEBUG] Login handleSubmit triggered');
        setError('');
        
        const validationError = validateForm();
        console.log('[DEBUG] Login validation error:', validationError);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        console.log('[DEBUG] Login sending fetch to:', `${API_BASE_URL}/api/tokens`);
        try {
            const response = await fetch(`${API_BASE_URL}/api/tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username.trim(), 
                    password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await setItem('token', data.token);
                await setItem('user', JSON.stringify(data.user));
                navigation.navigate('Restaurants');
            } else {
                setError(data.message || 'Invalid username or password.');
            }
        } catch (err) {
            console.error("[DEBUG] Login request error caught:", err);
            setError('Network error. Make sure the backend is running on port 5000.');
            console.error("Login request error", err);
        } finally {
            console.log('[DEBUG] Login finished. Setting loading to false');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.authCard, isDark ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
                        Login to Volt
                    </Text>

                    {error ? (
                        <View style={styles.alertError}>
                            <Text style={styles.alertErrorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Username</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            required
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Password</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            required
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.btn, styles.btnPrimary]} 
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, isDark ? styles.textLight : styles.textDark]}>
                            Don't have an account?{' '}
                            <Text 
                                style={styles.link} 
                                onPress={() => navigation.navigate('Register')}
                            >
                                Sign Up
                            </Text>
                        </Text>
                    </View>
                </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    authCard: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardLight: {
        backgroundColor: '#ffffff',
        borderColor: '#e8ecef',
    },
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2d2d2d',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    alertError: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    alertErrorText: {
        color: '#721c24',
        fontSize: 14,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        fontSize: 16,
    },
    inputLight: {
        borderColor: '#cccccc',
        backgroundColor: '#ffffff',
        color: '#333333',
    },
    inputDark: {
        borderColor: '#444444',
        backgroundColor: '#252525',
        color: '#ffffff',
    },
    btn: {
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    btnPrimary: {
        backgroundColor: '#28526e',
    },
    btnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
    },
    link: {
        color: '#00c2e8',
        fontWeight: 'bold',
    },
    textLight: {
        color: '#ffffff',
    },
    textDark: {
        color: '#333333',
    },
});
