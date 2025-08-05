import { configureStore } from '@reduxjs/toolkit'; // Simplified Redux store setup
import { combineReducers } from 'redux'; // Combines multiple reducers into one root reducer
import authReducer from './authSlice'; // Reducer for authentication state
import notesReducer from './notesSlice'; // Reducer for notes state
import AsyncStorage from '@react-native-async-storage/async-storage'; // Async storage for persisting Redux state on device

// Redux Persist imports for storing and rehydrating Redux state
import {
  persistStore, // Initializes the persistence layer
  persistReducer, // Enhances reducer to support persistence
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  notes: notesReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: 'root', // Storage key prefix
  storage: AsyncStorage, // Use React Native's AsyncStorage for persistence
};

// Create a persisted reducer using the configuration above
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted version of the reducer
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Bypass Redux Persist's non-serializable action warnings
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor to control persistence rehydration
export const persistor = persistStore(store);

// Types for global state and dispatch
export type RootState = ReturnType<typeof store.getState>; // Inferred type of the entire state tree
export type AppDispatch = typeof store.dispatch; // Type-safe dispatch for use with hooks
