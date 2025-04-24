import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Canvas, Image } from '@shopify/react-native-skia';
import type { SkImage } from '@shopify/react-native-skia';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

interface TransformationScreenProps {
  sketchImage: SkImage | null;
  selectedStyle: any;
}

const TransformationScreen: React.FC<TransformationScreenProps> = ({
  sketchImage,
  selectedStyle,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#50E3C2']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Transforming your sketch...</Text>
        <Text style={styles.subtitle}>into {selectedStyle?.name?.toLowerCase()} style</Text>
        
        <View style={styles.canvasContainer}>
          {sketchImage && (
            <Canvas style={styles.canvas}>
              <Image
                image={sketchImage}
                x={0}
                y={0}
                width={width - 64}
                height={width - 64}
                fit="contain"
              />
            </Canvas>
          )}
        </View>

        <View style={styles.lottieContainer}>
          <LottieView
            ref={animationRef}
            source={require('../../assets/animations/transform.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 36,
    textAlign: 'center',
  },
  canvasContainer: {
    width: width - 48,
    height: width - 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 48,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  lottieContainer: {
    width: width,
    height: 180,
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 260,
    height: 260,
  },
});

export default TransformationScreen; 