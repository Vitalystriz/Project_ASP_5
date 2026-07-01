import { useState, useContext } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { clientStyles as styles } from '../src/styles/client.styles';
import AppButton from '../src/components/MainButton';
import BackButton from '../src/components/BackButton';
import { BASE_URL } from '../config';
import { UserContext } from '../src/context/UserContext'; 

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext); 
 
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const tokenData = await response.json(); 
        
        setUser(tokenData.user);

        // ומנווטים פנימה
        router.replace('/(client-tabs)/order');
      } else {
        const errorData = await response.json();
        Alert.alert('Login Failed', errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to server.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.logo}>Volt delivery</Text>
      <Text style={styles.subtitle}>Please Log in</Text>
      
      <TextInput 
        placeholder="Username" 
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" 
      />
      
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      
      <AppButton
        title="Log in"
        onPress={handleLogin} 
      />

      <View style={styles.bottomSection}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Link href="/client-register" style={styles.linkText}>
          Sign up here
        </Link>
      </View>
    </View>
  );
}