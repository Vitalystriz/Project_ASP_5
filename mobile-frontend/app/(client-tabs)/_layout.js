import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. ייבוא הספרייה
import { layoutStyles as styles, TAB_COLORS, ICON_SIZE } from '../../styles/layout.styles'; 

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tabs 
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8, 
        },
        tabBarActiveTintColor: TAB_COLORS.active, 
        tabBarInactiveTintColor: TAB_COLORS.inactive, 
        headerShown: false, 
      }}
    >
      
      <Tabs.Screen
        name="order" 
        options={{
          title: 'Order',
          tabBarIcon: ({ color }) => (
            <Ionicons name="fast-food" size={ICON_SIZE} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={ICON_SIZE} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}