import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { API_KEY, URL } from '@env';
import { COLORS, GRADIENT_COLORS } from '../constants/theme';
import ActionButton from '../components/buttons/ActionButton';

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
  const [transformedImage, setTransformedImage] = useState<string | null>(route.params.transformedImage || null);
  const [saving, setSaving] = useState(false);
  const { sketchImage, selectedStyle } = route.params;

  useEffect(() => {
    if (route.params.transformedImage) return;
    const transformImage = async () => {
      try {
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
          Alert.alert('Error', 'Invalid API key. Please check your configuration.');
        } else if (axios.isAxiosError(err) && err.response?.status === 429) {
          Alert.alert('Error', 'Too many requests. Please try again later.');
        } else {
          Alert.alert('Error', 'Failed to transform image. Please try again.');
        }
      }
    };
    transformImage();
  }, [sketchImage, selectedStyle, route.params.transformedImage]);

  const handleShare = useCallback(async () => {
    if (!transformedImage) return;
    
    try {
      const uri = FileSystem.cacheDirectory + 'transformed-sketch.png';
      await FileSystem.writeAsStringAsync(uri, transformedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      await Share.share({
        url: uri,
        message: 'Check out my transformed sketch!',
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to share image');
    }
  }, [transformedImage]);

  const handleSave = useCallback(async () => {
    if (!transformedImage) return;
    
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to save images');
        return;
      }

      const uri = FileSystem.cacheDirectory + 'transformed-sketch.png';
      await FileSystem.writeAsStringAsync(uri, transformedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success', 'Image saved to your photos!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save image');
    } finally {
      setSaving(false);
    }
  }, [transformedImage]);

  const handleDone = useCallback(() => {
    navigation.navigate('Drawing');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={GRADIENT_COLORS.PRIMARY}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullScreenGradient}
      >
        <SafeAreaView style={[styles.safeArea, { marginTop: 120 }]}>
          <View style={styles.content}>
            <View style={styles.resultCanvasWrapper}>
              {transformedImage && (
                <Image
                  source={{ uri: `data:image/png;base64,${transformedImage}` }}
                  style={styles.transformedImage}
                  resizeMode="contain"
                />
              )}
            </View>

            <View style={styles.actionsContainer}>
              <ActionButton
                onPress={handleShare}
                icon="share-outline"
                text="Share"
                size="medium"
                variant="action"
              />
              <ActionButton
                onPress={handleSave}
                icon={saving ? "cloud-download-outline" : "save-outline"}
                text={saving ? 'Saving...' : 'Save'}
                size="medium"
                variant="action"
                disabled={saving}
              />
            </View>

            <ActionButton
              onPress={handleDone}
              icon="checkmark"
              text="Done"
              size="large"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resultCanvasWrapper: {
    width: width * 0.9,
    height: height * 0.45,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.TEXT.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignSelf: 'center',
    marginBottom: 36,
  },
  transformedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
});

export default TransformationScreen; 