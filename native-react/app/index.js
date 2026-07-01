import { indexStyles as styles } from '../src/styles/index.styles';
import { View, Text, TouchableOpacity, Image} from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/Volt_Logo.png')} 
        style={styles.logo}
        resizeMode="contain" 
      />
      <Text style={styles.title}>Welcome to Volt</Text>
      
      <Text style={styles.subtitle}>The world's best delivery app!</Text>
      
      <Text style={styles.optionText}>How would you like to continue?</Text>

      
      <TouchableOpacity 
        style={[styles.button, styles.clientButton]} 
        onPress={() => router.push('/client-login')}
      >
        <Text style={styles.buttonText}>Order Food (Customer)</Text>
      </TouchableOpacity>

      
      <TouchableOpacity 
        style={[styles.button, styles.managerButton]} 
        onPress={() => router.push('/manager-login')}
      >
        <Text style={styles.buttonText}>Business owner (Manager)</Text>
      </TouchableOpacity>
    </View>
  );
}