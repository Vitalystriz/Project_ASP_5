import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, ThemeContext } from './src/utils/ThemeContext';
import Welcome from './src/pages/Welcome';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Restaurants from './src/pages/Restaurants';
import Restaurant from './src/pages/Restaurant';
import Product from './src/pages/Product';
import OrderPage from './src/pages/OrderPage';
import HistoryOrdersPage from './src/pages/HistoryOrdersPage';

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const { isDark } = React.useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? '#121212' : '#f8f9fa'
          }
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Restaurants" component={Restaurants} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="ActiveCart" component={OrderPage} />
        <Stack.Screen name="OrderHistory" component={HistoryOrdersPage} />
      </Stack.Navigator>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationWrapper />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
