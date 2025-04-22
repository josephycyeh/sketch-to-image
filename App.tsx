// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawingProvider } from './src/context/DrawingContext';
import DrawingScreen from './src/screens/DrawingScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawingProvider>
        <SafeAreaView style={styles.container}>
          <DrawingScreen />
        </SafeAreaView>
      </DrawingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
