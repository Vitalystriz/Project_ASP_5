import React, { useState, useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../utils/ThemeContext';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function Register({ navigation }) {
    const { isDark } = useContext(ThemeContext);

    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [picture, setPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert("Permission Required", "Permission to access media library is required!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setPicture(asset);
                setPicturePreview(asset.uri);
            }
        } catch (e) {
            console.error("Error picking image:", e);
            Alert.alert("Error", "Could not pick image");
        }
    };

    const validateForm = () => {
        if (!displayName.trim() || !username.trim() || !password || !verifyPassword || !picture) {
            return "All fields are required, including a profile picture.";
        }
        if (username.includes(' ')) {
            return "Username cannot contain spaces.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must contain a combination of letters and numbers.";
        }
        if (password !== verifyPassword) {
            return "Passwords do not match.";
        }
        if (!x.trim() || !y.trim()) {
            return "All fields are required, including location coordinates.";
        }
        return null;
    };

    const handleSubmit = async () => {
        console.log('[DEBUG] Register handleSubmit triggered');
        setError('');

        const validationError = validateForm();
        console.log('[DEBUG] Register validation error:', validationError);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        console.log('[DEBUG] Register sending fetch to:', `${API_BASE_URL}/api/users`);
        try {
            const formData = new FormData();
            formData.append('displayName', displayName.trim());
            formData.append('username', username.trim());
            formData.append('password', password);
            formData.append('x', parseFloat(x));
            formData.append('y', parseFloat(y));

            const uri = picture.uri;
            const name = uri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(name);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('picture', {
                uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                name: name,
                type: type,
            });

            const response = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${API_BASE_URL}/api/users`);
                xhr.setRequestHeader('Accept', 'application/json');
                
                xhr.onload = () => {
                    resolve({
                        ok: xhr.status >= 200 && xhr.status < 300,
                        json: async () => {
                            try {
                                return JSON.parse(xhr.responseText);
                            } catch (e) {
                                return { message: xhr.responseText || 'Registration failed' };
                            }
                        }
                    });
                };
                
                xhr.onerror = () => {
                    reject(new Error('Network request failed'));
                };
                
                xhr.send(formData);
            });

            if (response.ok) {
                console.log('[DEBUG] Register response success, navigating to Login');
                Alert.alert("Success", "Account created successfully! Please log in.");
                navigation.navigate('Login');
            } else {
                const data = await response.json();
                console.log('[DEBUG] Register response failed:', data);
                setError(data.message || 'Registration failed. Username might already exist.');
            }
        } catch (err) {
            console.error('[DEBUG] Register error caught:', err);
            setError('Network error. Make sure the backend is running on port 5000.');
            console.error("Registration error", err);
        } finally {
            console.log('[DEBUG] Register finished. Setting loading to false');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, isDark ? styles.bgDark : styles.bgLight]}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.authCard, isDark ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.title, isDark ? styles.textLight : styles.textDark]}>
                        Sign Up for Volt
                    </Text>

                    {error ? (
                        <View style={styles.alertError}>
                            <Text style={styles.alertErrorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Avatar picker */}
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity style={styles.avatarCircle} onPress={handlePickImage}>
                            {picturePreview ? (
                                <Image source={{ uri: picturePreview }} style={styles.avatarImg} />
                            ) : (
                                <Text style={styles.avatarUploadText}>Upload{"\n"}Picture</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Display Name</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Username</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>
                            Password <Text style={styles.hint}>(Min 8 chars, letters & numbers)</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Verify Password</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={verifyPassword}
                            onChangeText={setVerifyPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Location Coordinate X</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={x}
                            onChangeText={setX}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, isDark ? styles.textLight : styles.textDark]}>Location Coordinate Y</Text>
                        <TextInput
                            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                            value={y}
                            onChangeText={setY}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.btn, styles.btnSuccess]} 
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, isDark ? styles.textLight : styles.textDark]}>
                            Already have an account?{' '}
                            <Text 
                                style={styles.link} 
                                onPress={() => navigation.navigate('Login')}
                            >
                                Login
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
        padding: 20,
    },
    authCard: {
        width: '100%',
        maxWidth: 460,
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
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#00c2e8',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarUploadText: {
        textAlign: 'center',
        color: '#28526e',
        fontSize: 12,
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    hint: {
        fontSize: 11,
        fontWeight: 'normal',
        color: '#777777',
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
    btnSuccess: {
        backgroundColor: '#28a745',
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
