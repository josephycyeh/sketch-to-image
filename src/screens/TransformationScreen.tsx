import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { API_KEY, URL } from '@env';

type TransformationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Transformation'
>;

type TransformationScreenRouteProp = RouteProp<RootStackParamList, 'Transformation'>;

interface TransformationScreenProps {
  navigation: TransformationScreenNavigationProp;
  route: TransformationScreenRouteProp;
}

const TransformationScreen: React.FC<TransformationScreenProps> = ({
  navigation,
  route,
}) => {
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sketchImage, selectedStyle } = route.params;

  useEffect(() => {
    const transformImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post(`${URL}/generate-image`, {
          image: sketchImage,
          style: selectedStyle.id,
          model: 'gemini'
        }, {
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
          }
        });

        if (response.data?.success && response.data.image?.data) {
          setTransformedImage(response.data.image.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Transform error:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError('Invalid API key. Please check your configuration.');
        } else if (axios.isAxiosError(err) && err.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          setError('Failed to transform image. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    transformImage();
  }, [sketchImage, selectedStyle]);

  const handleRetry = () => {
    setLoading(true); // This will trigger the useEffect to try again
  };

  const handleDone = () => {
    navigation.navigate('Drawing');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4A90E2', '#50E3C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.loadingContainer}>
            <LottieView
              source={require('../../assets/animations/transform.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.loadingText}>Transforming your sketch...</Text>
            <Text style={styles.subText}>This may take a moment</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={80} color="#FFF" />
            <Text style={[styles.errorText, { color: '#FFF' }]}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Your Transformed Art</Text>
      </LinearGradient>

      <View style={styles.imageContainer}>
        {transformedImage && (
          <Image
            source={{ uri: `data:image/png;base64,${transformedImage}` }}
            style={styles.transformedImage}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
            <Ionicons name="checkmark" size={24} color="#fff" style={styles.doneIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  lottieAnimation: {
    width: width * 0.6,
    height: width * 0.6,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  transformedImage: {
    flex: 1,
    borderRadius: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  doneButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  doneIcon: {
    marginLeft: 4,
  },
});

export default TransformationScreen; 