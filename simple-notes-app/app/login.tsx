import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TextInput as RNTextInput,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/authSlice';
import { RootState } from './store';

export default function LoginScreen() {
  const router = useRouter();        // Used to navigate between screens
  const dispatch = useDispatch();    // Dispatch Redux actions
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn); // Get login state

  // Local state for form fields, error messages, and dark mode toggle
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Ref to move focus from username to password input
  const passwordRef = useRef<RNTextInput>(null);

  // Navigate to /home if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/home');
    }
  }, [isLoggedIn]);

  // Validates credentials and dispatches login if valid
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in both fields.');
    } else if (username === 'test' && password === 'password123') {
      setError('');
      dispatch(login()); // Simulate successful login
    } else {
      setError('Invalid username or password.');
    }
  };

  // Apply dark mode or light mode styles
  const theme = darkMode ? darkStyles : styles;

  return (
    <View style={theme.container}>
      <Text style={theme.appTitle}>📝 Simple Notes App</Text>
      <Text style={theme.title}>Login</Text>

      {/* Username input */}
      <TextInput
        placeholder="Username"
        placeholderTextColor={darkMode ? '#ccc' : undefined}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (error) setError(''); // Clear error as user types
        }}
        style={theme.input}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()} // Focus password field when "next" is pressed
        blurOnSubmit={false}
      />

      {/* Password input */}
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor={darkMode ? '#ccc' : undefined}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(''); // Clear error as user types
        }}
        secureTextEntry
        style={theme.input}
        returnKeyType="done"
        onSubmitEditing={handleLogin} // Submit login on "done"
      />

      {/* Error message if login fails */}
      {error ? <Text style={theme.error}>{error}</Text> : null}

      {/* Login button */}
      <View style={theme.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      {/* Dark mode toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: darkMode ? '#ccc' : '#333', marginRight: 8 }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
}

// Light mode styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    color: '#000',
  },
  buttonContainer: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

// Dark mode styles extending the light styles
const darkStyles = StyleSheet.create({
  ...styles,
  container: {
    ...styles.container,
    backgroundColor: '#121212',
  },
  appTitle: {
    ...styles.appTitle,
    color: '#fff',
  },
  title: {
    ...styles.title,
    color: '#ccc',
  },
  input: {
    ...styles.input,
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff',
  },
  error: {
    ...styles.error,
    color: '#ff6b6b',
  },
});
