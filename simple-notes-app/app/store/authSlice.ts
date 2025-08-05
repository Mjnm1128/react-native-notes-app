import { createSlice } from '@reduxjs/toolkit'; // Utility to create a slice of Redux state

// Define the shape of the authentication state
interface AuthState {
  isLoggedIn: boolean; // Tracks whether the user is authenticated
}

// Initial state for the auth slice
const initialState: AuthState = {
  isLoggedIn: false, // User starts off as logged out
};

// Create the auth slice with its reducers and initial state
const authSlice = createSlice({
  name: 'auth', // Name of the slice (used internally by Redux)
  initialState, // Set the default state
  reducers: {
    // Reducer for logging in: sets isLoggedIn to true
    login(state) {
      state.isLoggedIn = true;
    },
    // Reducer for logging out: sets isLoggedIn to false
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

// Export the actions for use in components
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
