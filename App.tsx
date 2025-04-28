// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SkImage } from '@shopify/react-native-skia';
import { DrawingProvider } from './src/context/DrawingContext';
import DrawingScreen from './src/screens/DrawingScreen';
import StyleSelectionScreen from './src/screens/StyleSelectionScreen';
import TransformationScreen from './src/screens/TransformationScreen';

export type RootStackParamList = {
  Drawing: undefined;
  StyleSelection: {
    sketchImage: string;
  };
  Transformation: {
    sketchImage: string;
    selectedStyle: {
      id: string;
      name: string;
      thumbnail: string;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawingProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Drawing" component={DrawingScreen} />
            <Stack.Screen name="StyleSelection" component={StyleSelectionScreen} />
            <Stack.Screen name="Transformation" component={TransformationScreen} />
          </Stack.Navigator>
        </DrawingProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
