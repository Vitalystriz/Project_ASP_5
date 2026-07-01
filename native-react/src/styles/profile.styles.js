import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    paddingTop: 200,
  },
  centerAll: {
    justifyContent: 'center',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2C2C2E',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#2C2C2E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    marginBottom: 40,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: 40,
    width: '80%',
  }
});