// src/screens/DrawingScreen.tsx
import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import DrawingCanvas from '../components/Canvas';
import Toolbar from '../components/ToolBar';
import ActionButton from '../components/buttons/ActionButton';
import CircleButton from '../components/buttons/CircleButton';
import { COLORS } from '../constants/theme';

type DrawingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Drawing'>;

interface DrawingScreenProps {
  navigation: DrawingScreenNavigationProp;
}

// Base64 string of a completely white/empty canvas
const EMPTY_CANVAS_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

const DrawingScreen: React.FC<DrawingScreenProps> = ({ navigation }) => {
  const canvasRef = useRef<View>(null);

  const handleSave = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save drawings');
        return;
      }

      const result = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(result);
      Alert.alert('Success', 'Drawing saved to your photos!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save drawing');
      console.error(err);
    }
  }, []);

  const handleTransformSketch = useCallback(async () => {
    try {
      if (!canvasRef.current) return;

      const image = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
        result: 'base64'
      });

      if (!image) {
        Alert.alert('Error', 'Failed to capture sketch');
        return;
      }

      if (image === EMPTY_CANVAS_BASE64) {
        Alert.alert('Error', 'You need to draw something before you transform!');
        return;
      }

      navigation.navigate('StyleSelection', { sketchImage: image });
    } catch (err) {
      console.error('Failed to capture sketch:', err);
      Alert.alert('Error', 'Failed to prepare sketch for transformation');
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.canvasSection}>
        <View style={styles.canvasContainer}>
          <View ref={canvasRef} collapsable={false} style={styles.canvasInner}>
            <DrawingCanvas />
          </View>
          <View style={styles.canvasOverlay} pointerEvents="none" />
          <CircleButton
            onPress={handleSave}
            icon="save-outline"
            gradient
            style={styles.saveButton}
          />
        </View>
      </View>
      
      <View style={styles.toolbarSection}>
        <Toolbar />
      </View>
      
      <View style={styles.buttonSection}>
        <ActionButton
          onPress={handleTransformSketch}
          icon="sparkles"
          text="Transform Sketch"
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  canvasSection: {
    flex: 1,
    margin: 16,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.TEXT.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  canvasInner: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  canvasOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: `${COLORS.PRIMARY}33`, // 20% opacity
    borderRadius: 24,
    borderStyle: 'dashed',
    pointerEvents: 'none',
  },
  toolbarSection: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.TEXT.PRIMARY,
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
    backgroundColor: COLORS.WHITE,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    elevation: 3,
    shadowColor: COLORS.TEXT.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});

export default DrawingScreen;
