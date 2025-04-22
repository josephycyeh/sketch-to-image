// src/screens/DrawingScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import DrawingCanvas from '../components/Canvas';
import Toolbar from '../components/ToolBar';

const DrawingScreen: React.FC = () => (
  <View style={styles.container}>
    <DrawingCanvas />
    <Toolbar />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default DrawingScreen;
