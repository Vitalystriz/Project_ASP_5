import { TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackButtonStyles as styles } from '../styles/BackButton.styles';

export default function BackButton({ color = '#333' }) {
  const router = useRouter();


  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.buttonContainer} 
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={28} color={color} />
    </TouchableOpacity>
  );
}