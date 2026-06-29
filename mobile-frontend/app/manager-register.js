import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { managerStyles as styles, PLACEHOLDER_COLOR, BACK_BUTTON_COLOR } from '../styles/manager.styles';
import AppButton from '../components/MainButton';
import BackButton from '../components/BackButton';
import { BASE_URL } from '../config';

export default function Register() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [picture, setPicture] = useState(null);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPicture(result.assets[0]);
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
    return null;
  };

  const handleSubmit = async () => {
    console.log("1. --- Button was clicked! ---");

    const validationError = validateForm();
    if (validationError) {
      console.log("2. Validation failed:", validationError);
      Alert.alert('Registration Error', validationError);
      return;
    }

    console.log("3. Validation passed! Preparing FormData...");

    try {
      const formData = new FormData();
      formData.append('displayName', displayName);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('x', x);
      formData.append('y', y);
      formData.append('role', 'customer'); 
      
      if (picture) {
        formData.append('picture', {
          uri: picture.uri,
          name: picture.fileName || 'profile.jpg',
          type: picture.mimeType || 'image/jpeg',
        });
      }

      // הוספתי פה /register - תשנה את זה אם הנתיב בבקאנד שלך שונה!
      const targetUrl = `${BASE_URL}/register`; 
      console.log("4. Sending fetch request to:", targetUrl);

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            // ב-React Native אין צורך להגדיר Content-Type עבור FormData, זה נעשה אוטומטית
        },
      });

      console.log("5. Response received! Status:", response.status);

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/client-login');
      } else {
        const data = await response.json();
        console.log("6. Server returned an error:", data);
        Alert.alert('Error', data.message || 'Registration failed. Username might already exist.');
      }
    } catch (err) {
      console.log("7. Caught an error in catch block:", err);
      Alert.alert('Network Error', 'Make sure the backend is running and the IP address is correct.');
    }
  };

  return (
    
    <View style={styles.mainBackground} >
    <BackButton color={BACK_BUTTON_COLOR} />

    <ScrollView contentContainerStyle={styles.scrollContent} >
      <Text style={styles.title}>Sign Up for Volt</Text>

      <TouchableOpacity 
        style={styles.imageUploadContainer} 
        onPress={pickImage}
      >
        {picture ? (
          <Image source={{ uri: picture.uri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Upload{'\n'}Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput 
        placeholder="Display Name" 
        style={styles.input} 
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={displayName} 
        onChangeText={setDisplayName} 
      />
      <TextInput 
        placeholder="Username" 
        style={styles.input} 
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none" 
      />
      <TextInput 
        placeholder="Password (Min 8 chars, letters & numbers)" 
        style={styles.input} 
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <TextInput 
        placeholder="Verify Password" 
        style={styles.input} 
        placeholderTextColor={PLACEHOLDER_COLOR}
        value={verifyPassword} 
        onChangeText={setVerifyPassword} 
        secureTextEntry 
      />
      
      <AppButton title="Create Account" onPress={handleSubmit} />

      <View style={styles.bottomSection}>
        <Text style={styles.text}>Already have an account?</Text>
        <Link href="/manager-login" style={styles.linkText}>Login here</Link>
      </View>
    </ScrollView>
    </View>
  );
}