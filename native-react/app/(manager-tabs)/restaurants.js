import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles as styles } from '../../src/styles/home.styles'; 

export default function TabHomeManager() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/manager-login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.smallLogoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.title}>
            WELCOME INSIDE!{"\n"}
            Would you like to add a restaurant {"\n"}
            or edit a menu of 1 of your restaurants
            </Text>
      </View>
    </SafeAreaView>
  );
}