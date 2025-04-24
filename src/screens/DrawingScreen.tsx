// src/screens/DrawingScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import DrawingCanvas from '../components/Canvas';
import Toolbar from '../components/ToolBar';
import StyleSelectionScreen from './StyleSelectionScreen';
import TransformationScreen from './TransformationScreen';
import { makeImageFromView } from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';

const { width } = Dimensions.get('window');

type Screen = 'drawing' | 'style' | 'transforming';

const DrawingScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('drawing');
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const canvasRef = useRef<View>(null);
  const [capturedImage, setCapturedImage] = useState<SkImage | null>(null);

  const handleSave = async () => {
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save drawings');
        return;
      }

      // Capture the canvas view
      const result = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
      });

      // Save to camera roll
      await MediaLibrary.saveToLibraryAsync(result);
      Alert.alert('Success', 'Drawing saved to your photos!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save drawing');
      console.error(err);
    }
  };

  const handleTransformSketch = async () => {
    try {
      if (canvasRef.current) {
        const image = await makeImageFromView(canvasRef);
        setCapturedImage(image);
      }
    } catch (err) {
      console.error('Failed to capture sketch before style selection:', err);
    }
    setCurrentScreen('style');
  };

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style);
    setCurrentScreen('transforming');
  };

  if (currentScreen === 'transforming') {
    return (
      <TransformationScreen
        sketchImage={capturedImage}
        selectedStyle={selectedStyle}
      />
    );
  }

  if (currentScreen === 'style') {
    return (
      <StyleSelectionScreen
        onBack={() => setCurrentScreen('drawing')}
        onContinue={handleStyleSelect}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.titleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="brush" size={24} color="#fff" />
          </View>
          <Text style={styles.title}>Create Your Sketch</Text>
        </View>
        <Text style={styles.subtitle}>Draw anything and transform it into art!</Text>
      </LinearGradient>
      
      <View style={styles.canvasSection}>
        <View style={styles.decorationCircle} />
        <View style={styles.decorationSquare} />
        <View style={styles.canvasContainer}>
          <View ref={canvasRef} collapsable={false} style={styles.canvasInner}>
            <DrawingCanvas />
          </View>
          <View style={styles.canvasOverlay} pointerEvents="none" />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['rgba(74, 144, 226, 0.9)', 'rgba(80, 227, 194, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.toolbarSection}>
        <Toolbar />
      </View>
      
      <View style={styles.buttonSection}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.transformButton}
        >
          <TouchableOpacity
            style={styles.transformButtonContent}
            onPress={handleTransformSketch}
          >
            <Ionicons name="sparkles" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Transform Sketch</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    paddingTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  canvasSection: {
    flex: 1,
    margin: 16,
  },
  decorationCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(80, 227, 194, 0.1)',
    top: -30,
    right: -30,
  },
  decorationSquare: {
    position: 'absolute',
    width: 80,
    height: 80,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    bottom: 40,
    left: -20,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  canvasInner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  canvasOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 24,
    borderStyle: 'dashed',
    pointerEvents: 'none',
  },
  toolbarSection: {
    backgroundColor: '#fff',
    paddingBottom: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  transformButton: {
    borderRadius: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  transformButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  saveButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default DrawingScreen;
