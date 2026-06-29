import { StyleSheet } from 'react-native';
export const PLACEHOLDER_COLOR = '#8e8e93';
export const BACK_BUTTON_COLOR = '#ffffff';

export const managerStyles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1C1C1E',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1C1C1E', 
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#ffffff', 
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff', 
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93', 
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#2C2C2E', 
    borderWidth: 1,
    borderColor: '#3A3A3C', 
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff', 
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2C2C2E', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#8e8e93', 
  },
  bottomSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff', 
    fontSize: 15,
  },
  linkText: {
    color: '#009de0', 
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 15,
  }
});