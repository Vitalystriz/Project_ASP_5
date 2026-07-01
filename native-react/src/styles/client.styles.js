import { StyleSheet } from 'react-native';

export const clientStyles = StyleSheet.create({
  
  mainBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff', 
  },

  
  logo: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#009de0', 
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  locationInput: {
    flex: 1, 
  },

 
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#6c757d',
  },
 bottomSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    color: '#333',
    fontSize: 15,
  },
  linkText: {
    color: '#009de0',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 15,
  }
});