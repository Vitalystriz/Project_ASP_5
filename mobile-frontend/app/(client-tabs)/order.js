import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles as styles } from '../../styles/home.styles'; 

export default function TabHomeOrder() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/client-login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.smallLogoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.title}>WELCOME INSIDE!{"\n"}What would you like to order?</Text>
      </View>
    </SafeAreaView>
  );
}