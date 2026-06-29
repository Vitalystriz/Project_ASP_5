import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { managerStyles as styles, PLACEHOLDER_COLOR, BACK_BUTTON_COLOR } from '../styles/manager.styles';
import AppButton from '../components/MainButton';
import BackButton from '../components/BackButton';
import { BASE_URL } from '../config';

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    try {
     
      const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, password }),
});

      if (response.ok) {
       
        router.replace('/(tabs)');
      } else {
        const errorData = await response.json();
        Alert.alert('Login Failed', errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };

  
  return (
    <View style={styles.container}>
      <BackButton/>
      <Text style={styles.logo}>Volt-manager</Text>
      <Text style={styles.subtitle}>Please Log in</Text>
      
      <TextInput 
        placeholder="Username" 
        style={styles.input}
        value={username}
        placeholderTextColor={PLACEHOLDER_COLOR}
        onChangeText={setUsername}
        autoCapitalize="none" 
      />
      
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        placeholderTextColor={PLACEHOLDER_COLOR}
        onChangeText={setPassword}
      />
      
      <AppButton
        title="Log in"
        onPress={handleLogin} 
      />

      <View style={styles.bottomSection}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Link href="/manager-register" style={styles.linkText}>
          Sign up here
        </Link>
      </View>
    </View>
  );
}