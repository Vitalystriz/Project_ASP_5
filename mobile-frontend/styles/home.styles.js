import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E1E', 
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end', 
  },
  smallLogoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ff4444', 
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF00', // ירוק וולט בולט
  }
});