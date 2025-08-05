import { Slot } from 'expo-router'; // Slot is a placeholder for the active screen component in expo-router
import { Provider } from 'react-redux'; // Provides Redux store to the React component tree
import { store, persistor } from './store'; // Import configured Redux store and persistor instance
import { PersistGate } from 'redux-persist/integration/react'; // Delays rendering until persisted state has been rehydrated

export default function Layout() {
  return (
    // Wrap the entire app with Redux Provider so components can access the store
    <Provider store={store}>
      {/* PersistGate ensures persisted state is loaded before rendering the app */}
      <PersistGate loading={null} persistor={persistor}>
        {/* Slot renders the currently matched route from expo-router */}
        <Slot />
      </PersistGate>
    </Provider>
  );
}
