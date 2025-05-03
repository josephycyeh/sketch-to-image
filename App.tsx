// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SkImage } from '@shopify/react-native-skia';
import { DrawingProvider } from './src/context/DrawingContext';
import DrawingScreen from './src/screens/DrawingScreen';
import StyleSelectionScreen from './src/screens/StyleSelectionScreen';
import TransformationScreen from './src/screens/TransformationScreen';
import TransformingScreen from './src/screens/TransformingScreen';
import DrawingHeader from './src/components/DrawingHeader';
import StyleSelectionHeader from './src/components/StyleSelectionHeader';
import TransformationHeader from './src/components/TransformationHeader';
import Superwall from "@superwall/react-native-superwall"

export type RootStackParamList = {
  Drawing: undefined;
  StyleSelection: {
    sketchImage: string;
  };
  Transforming: {
    sketchImage: string;
    selectedStyle: {
      id: string;
      name: string;
      thumbnail: string;
      paid?: boolean;
    };
    model: 'gemini' | 'openai';
  };
  Transformation: {
    sketchImage: string;
    selectedStyle: {
      id: string;
      name: string;
      thumbnail: string;
      paid?: boolean;
    };
    transformedImage?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const apiKey = "pk_aec915cd4a8555621f71654ad34b20234e51b402a3d7d4e3"
    Superwall.configure({
      apiKey: apiKey,
    })
  }, [])
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawingProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Drawing"
              component={DrawingScreen}
              options={{
                header: () => (
                  <DrawingHeader
                    title="Create your masterpiece"
                    subtitle="Draw anything and transform it into art!"
                  />
                ),
              }}
            />
            <Stack.Screen 
              name="StyleSelection" 
              component={StyleSelectionScreen}
              options={({ navigation }) => ({
                header: () => (
                  <StyleSelectionHeader
                    onBack={() => navigation.goBack()}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Transforming"
              component={TransformingScreen}
              options={({ navigation }) => ({
                header: () => (
                  <TransformationHeader
                    onBack={() => navigation.goBack()}
                  />
                ),
                headerTransparent: true,
              })}
            />
            <Stack.Screen 
              name="Transformation" 
              component={TransformationScreen}
              options={({ navigation, route }) => ({
                header: () => (
                  <TransformationHeader
                    onBack={() => navigation.goBack()}
                    title="Your Transformed Art"
                    subtitle={`${route.params.selectedStyle.name} Style`}
                  />
                ),
                headerTransparent: true,
              })}
            />
          </Stack.Navigator>
        </DrawingProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
