import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, useColorScheme, Platform } from 'react-native';
import OrderPage from './src/pages/OrderPage';
import HistoryOrdersPage from './src/pages/HistoryOrdersPage';
import { setItem } from './src/utils/storage';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
    const [userIdInput, setUserIdInput] = useState('65f8a2b5c9e2b10a4f8d2200'); // Default Mock ID
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleSaveUser = async () => {
        if (!userIdInput.trim()) {
            Alert.alert("Error", "Please enter a valid User ID");
            return;
        }
        try {
            await setItem('user', JSON.stringify({ id: userIdInput.trim(), username: "Guest User" }));
            Alert.alert("Success", `User ID set in storage: ${userIdInput.trim()}`);
        } catch (e) {
            Alert.alert("Error", "Failed to save user id to storage");
        }
    };

    return (
        <View style={[styles.homeContainer, isDark && styles.bgDark]}>
            <Text style={[styles.title, isDark && styles.textDark]}>Volt Mobile Terminal</Text>
            
            <View style={[styles.loginCard, isDark && styles.loginCardDark]}>
                <Text style={[styles.label, isDark && styles.textDark]}>Mock User Session ID</Text>
                <TextInput
                    style={[styles.input, isDark && styles.inputDark]}
                    value={userIdInput}
                    onChangeText={setUserIdInput}
                    placeholder="Enter MongoDB User ID"
                    placeholderTextColor={isDark ? "#666666" : "#aaaaaa"}
                />
                <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveUser}>
                    <Text style={styles.btnText}>Set User Context</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity 
                    style={[styles.menuBtn, isDark && styles.menuBtnDark, styles.borderCart]} 
                    onPress={() => navigation.navigate('ActiveCart', { userId: userIdInput.trim() })}
                >
                    <Text style={[styles.menuBtnText, styles.textCart]}>🛒 Active Cart Terminal</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.menuBtn, isDark && styles.menuBtnDark, styles.borderHistory]} 
                    onPress={() => navigation.navigate('OrderHistory', { userId: userIdInput.trim() })}
                >
                    <Text style={[styles.menuBtnText, styles.textHistory]}>📜 Order History Terminal</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          },
          headerTintColor: isDark ? '#a0c0d8' : '#28526e',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Volt Terminal Portal' }} />
        <Stack.Screen name="ActiveCart" component={OrderPage} options={{ title: 'Active Checkout' }} />
        <Stack.Screen name="OrderHistory" component={HistoryOrdersPage} options={{ title: 'Order History' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bgDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#28526e',
    marginBottom: 32,
    textAlign: 'center',
  },
  textDark: {
    color: '#ffffff',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8ecef',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loginCardDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2d2d2d',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5f6368',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: '#333333',
  },
  inputDark: {
    backgroundColor: '#252525',
    borderColor: '#444444',
    color: '#ffffff',
  },
  btnPrimary: {
    backgroundColor: '#28526e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  menuBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  menuBtnDark: {
    backgroundColor: '#1a1a1a',
  },
  borderCart: {
    borderColor: '#00c2e8',
  },
  borderHistory: {
    borderColor: '#28a745',
  },
  menuBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textCart: {
    color: '#00c2e8',
  },
  textHistory: {
    color: '#28a745',
  },
});
