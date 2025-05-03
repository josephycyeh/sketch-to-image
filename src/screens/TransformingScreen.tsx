import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import axios from 'axios';
import { API_KEY, URL } from '@env';
import { GRADIENT_COLORS } from '../constants/theme';

// Navigation types

type TransformingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Transforming'
>;

type TransformingScreenRouteProp = RouteProp<RootStackParamList, 'Transforming'>;

interface TransformingScreenProps {
  navigation: TransformingScreenNavigationProp;
  route: TransformingScreenRouteProp;
}

const TransformingScreen: React.FC<TransformingScreenProps> = ({ navigation, route }) => {
  const { sketchImage, selectedStyle, model } = route.params;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const transformImage = async () => {
      try {
        setError(null);
        const response = await axios.post(`${URL}/generate-image`, {
          image: sketchImage,
          style: selectedStyle.id,
          model: model,
        }, {
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        if (response.data?.success && response.data.image?.data) {
          if (!controller.signal.aborted) {
            navigation.replace('Transformation', {
              sketchImage,
              selectedStyle,
              transformedImage: response.data.image.data,
            });
          }
        } else {
          if (!controller.signal.aborted) {
            throw new Error('Invalid response format from server');
          }
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else if (!controller.signal.aborted) {
          setError('Failed to transform image. Please try again.');
        }
      }
    };
    transformImage();

    return () => {
      controller.abort();
    };
  }, [sketchImage, selectedStyle, model, navigation]);

  const handleRetry = () => {
    setError(null);
    navigation.replace('Transforming', { sketchImage, selectedStyle, model });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={GRADIENT_COLORS.PRIMARY}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <LottieView
              source={require('../../assets/animations/transform.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.loadingText}>Transforming your sketch...</Text>
            <Text style={styles.subText}>This may take a moment</Text>
            {error && (
              <>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lottieAnimation: {
    width: width * 0.7,
    height: width * 0.7,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 32,
    textAlign: 'center',
  },
  subText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    color: '#FFF',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default TransformingScreen; 