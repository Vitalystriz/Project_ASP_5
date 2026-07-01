import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { managerStyles as styles, PLACEHOLDER_COLOR, BACK_BUTTON_COLOR } from '../src/styles/manager.styles';
import AppButton from '../src/components/MainButton';
import BackButton from '../src/components/BackButton';
import { BASE_URL } from '../config';

export default function Register() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [picture, setPicture] = useState(null);
  const [x, setX] = useState('');
  const [y, setY] = useState('');

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
    if (!x.trim() || !y.trim()) {
      return "Location coordinates are required.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Registration Error', validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('displayName', displayName);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('x', x);
      formData.append('y', y);
      formData.append('role', 'manager'); 
      
      if (picture) {
        formData.append('picture', {
          uri: picture.uri,
          name: picture.fileName || 'profile.jpg',
          type: picture.mimeType || 'image/jpeg',
        });
      }

      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Manager account created successfully!');
        router.replace('/manager-login');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Registration failed. Username might already exist.');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Make sure the backend is running and the IP address is correct.');
      console.error(err);
    }
  };

  return (
    <View style={styles.mainBackground}>
      <BackButton color={BACK_BUTTON_COLOR} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sign Up for Volt (Manager)</Text>

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
        
        {/* העיצוב המעודכן לשדות המיקום, בדיוק כמו בלקוח */}
        <View style={styles.locationContainer}>
          <TextInput 
            placeholder="Location X" 
            style={[styles.input, styles.locationInput]} 
            placeholderTextColor={PLACEHOLDER_COLOR}
            value={x} 
            onChangeText={setX} 
            keyboardType="numeric" 
          />
          <TextInput 
            placeholder="Location Y" 
            style={[styles.input, styles.locationInput]} 
            placeholderTextColor={PLACEHOLDER_COLOR}
            value={y} 
            onChangeText={setY} 
            keyboardType="numeric" 
          />
        </View>
        
        <AppButton title="Create Account" onPress={handleSubmit} />

        <View style={styles.bottomSection}>
          <Text style={styles.text}>Already have an account?</Text>
          <Link href="/manager-login" style={styles.linkText}>Login here</Link>
        </View>
      </ScrollView>
    </View>
  );
}