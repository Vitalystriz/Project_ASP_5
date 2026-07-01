import { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AppButton from '../../src/components/MainButton';
import { profileStyles as styles } from '../../src/styles/profile.styles';
import { UserContext } from '../../src/context/UserContext'; 
import { BASE_URL } from '../../config';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext); 

  const handleLogout = () => {
    setUser(null); 
    router.replace('/manager-login'); 
  };

  return (
    <View style={styles.container}>
      {user?.profilePic ? (
  <Image 
    source={{ 
      uri: user.profilePic.startsWith('data:image') 
        ? user.profilePic 
        : `${BASE_URL}/uploads/${user.profilePic}` 
    }} 
    style={styles.profilePic} 
  />
) : (
  <View style={styles.profilePicPlaceholder} />
)}
      
      <Text style={styles.title}>{user?.displayName || 'Anonymous user'}</Text>
      <Text style={styles.subtitle}>@{user?.username || 'username'}</Text>
      <Text style={styles.subtitle}>user type: Manager</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Location X: {user?.x || 'N/A'}</Text>
        <Text style={styles.infoText}>Location Y: {user?.y || 'N/A'}</Text>
      </View>

      <View style={styles.logoutContainer}>
        <AppButton title="Log Out" onPress={handleLogout} />
      </View>
    </View>
  );
}