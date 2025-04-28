import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import axios from 'axios';
import { API_KEY, URL } from '@env';

type StyleSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StyleSelection'
>;

type StyleSelectionScreenRouteProp = RouteProp<RootStackParamList, 'StyleSelection'>;

interface StyleSelectionScreenProps {
  navigation: StyleSelectionScreenNavigationProp;
  route: StyleSelectionScreenRouteProp;
}

interface Style {
  id: string;
  name: string;
  thumbnail: string;
}

const PRIMARY = '#4A90E2';
const SECONDARY = '#50E3C2';
const BG_GRADIENT: [string, string] = ['#f7fbff', '#eaf6ff'];
const CARD_BORDER = PRIMARY;
const BUTTON_BG = PRIMARY;
const BUTTON_BG_DISABLED = '#D1E6FA';
const BUTTON_TEXT = '#fff';
const BUTTON_TEXT_DISABLED = '#A0A0A0';

// Memoized style card component for better performance and refined design
const StyleCard = memo(({ 
  item, 
  isSelected, 
  onSelect 
}: { 
  item: Style; 
  isSelected: boolean; 
  onSelect: (style: Style) => void;
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Pressable
      style={({ pressed }) => [
        componentStyles.styleCard,
        isSelected && componentStyles.selectedCard,
        pressed && componentStyles.cardPressed,
      ]}
      onPress={() => onSelect(item)}
      android_ripple={{ color: '#eaf6ff' }}
    >
      <View style={componentStyles.imageWrapper}>
        {imageLoading && (
          <View style={componentStyles.imagePlaceholder}>
            <ActivityIndicator size="small" color={PRIMARY} />
          </View>
        )}
        <Image
          source={{ 
            uri: item.thumbnail,
            cache: 'force-cache',
          }}
          style={[
            componentStyles.thumbnail,
            imageLoading && { opacity: 0 }
          ]}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoad={() => setImageLoading(false)}
        />
        {/* Overlay with style name */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={componentStyles.labelOverlay}
        >
          <Text style={componentStyles.styleName}>{item.name}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
});

const StyleSelectionScreen: React.FC<StyleSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sketchImage } = route.params;

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await axios.get(`${URL}/styles`, {
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
          }
        });
        if (response.data?.success && Array.isArray(response.data.styles)) {
          console.log('Styles set:', response.data.styles);
          setStyles(response.data.styles);
        } else {
          setError('Failed to load styles');
        }
      } catch (err) {
        setError('Failed to load styles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
  }, []);

  const handleStyleSelect = useCallback((style: Style) => {
    setSelectedStyle(style.id);
  }, []);

  const handleContinue = () => {
    if (selectedStyle) {
      const style = styles.find(s => s.id === selectedStyle);
      if (style) {
        navigation.navigate('Transformation', {
          sketchImage,
          selectedStyle: style,
        });
      }
    }
  };

  const renderItem = useCallback(({ item }: { item: Style }) => {
    const isSelected = selectedStyle === item.id;
    return (
      <StyleCard
        item={item}
        isSelected={isSelected}
        onSelect={handleStyleSelect}
      />
    );
  }, [selectedStyle, handleStyleSelect]);

  const keyExtractor = useCallback((item: Style) => item.id, []);

  const getItemLayout = useCallback((data: ArrayLike<Style> | null | undefined, index: number) => ({
    length: cardWidth,
    offset: (cardWidth + 16) * index,
    index,
  }), []);

  const renderContent = () => (
    <SafeAreaView style={containerStyle.container}>
      <View style={containerStyle.header}>
        <TouchableOpacity
          style={containerStyle.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={containerStyle.title}>Choose Style</Text>
        <View style={containerStyle.backButton} />
      </View>

      <View style={containerStyle.sketchContainer}>
        <View style={containerStyle.sketchWrapper}>
          <Image
            source={{ uri: `data:image/png;base64,${sketchImage}` }}
            style={containerStyle.sketchImage}
            resizeMode="contain"
          />
        </View>
        <Text style={containerStyle.instruction}>
          Select a style to transform your sketch
        </Text>
      </View>

      <View style={componentStyles.stylesSection}>
        <FlatList
          data={styles}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={componentStyles.gridContainer}
          snapToInterval={cardWidth + 16}
          decelerationRate="fast"
          snapToAlignment="center"
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={3}
          initialNumToRender={3}
        />
      </View>

      <View style={componentStyles.footer}>
        {selectedStyle ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            style={componentStyles.continueWrapper}
          >
            <LinearGradient
              colors={[PRIMARY, SECONDARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={componentStyles.continueButton}
            >
              <Text style={componentStyles.continueButtonText}>Transform Sketch</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={BUTTON_TEXT}
                style={componentStyles.continueIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={[componentStyles.continueButton, componentStyles.continueButtonDisabled]}>
            <Text style={componentStyles.continueButtonTextDisabled}>Transform Sketch</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={BUTTON_TEXT_DISABLED}
              style={componentStyles.continueIcon}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <LinearGradient colors={BG_GRADIENT} style={{ flex: 1 }}>
        <SafeAreaView style={containerStyle.container}>
          <View style={containerStyle.header}>
            <TouchableOpacity
              style={containerStyle.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={containerStyle.title}>Choose Style</Text>
            <View style={containerStyle.backButton} />
          </View>
          <View style={containerStyle.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={containerStyle.loadingText}>Loading styles...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={BG_GRADIENT} style={{ flex: 1 }}>
        <SafeAreaView style={containerStyle.container}>
          <View style={containerStyle.header}>
            <TouchableOpacity
              style={containerStyle.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={containerStyle.title}>Choose Style</Text>
            <View style={containerStyle.backButton} />
          </View>
          <View style={containerStyle.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF3B30" />
            <Text style={containerStyle.errorText}>{error}</Text>
            <TouchableOpacity
              style={containerStyle.retryButton}
              onPress={() => setLoading(true)}
            >
              <Text style={containerStyle.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={BG_GRADIENT} style={{ flex: 1 }}>
      {renderContent()}
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.35;
const cardHeight = cardWidth * 1.1;

const containerStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.2,
  },
  sketchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    alignItems: 'center',
  },
  sketchWrapper: {
    width: width * 0.8,
    height: height * 0.35,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  instruction: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

const componentStyles = StyleSheet.create({
  stylesSection: {
    flex: 1,
    marginTop: 0,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  styleCard: {
    width: cardWidth,
    height: cardHeight,
    marginHorizontal: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedCard: {
    borderColor: CARD_BORDER,
    borderWidth: 2.5,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  labelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    backgroundColor: 'transparent',
  },
  continueWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  continueButtonDisabled: {
    backgroundColor: BUTTON_BG_DISABLED,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: BUTTON_TEXT,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  continueButtonTextDisabled: {
    fontSize: 17,
    fontWeight: '700',
    color: BUTTON_TEXT_DISABLED,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  continueIcon: {
    marginLeft: 4,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
});

export default StyleSelectionScreen;