import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import axios from 'axios';
import { API_KEY, URL } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyleSelectionHeader from '../components/StyleSelectionHeader';
import { COLORS, GRADIENT_COLORS } from '../constants/theme';
import { MODEL_OPTIONS, ModelType } from '../constants/models';
import ActionButton from '../components/buttons/ActionButton';
import Superwall from '@superwall/react-native-superwall';

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
  paid?: boolean;
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

  useEffect(() => {
    setImageLoading(true);
  }, [item.thumbnail]);

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
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
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
          onLoadEnd={() => setImageLoading(false)}
        />
        {/* Overlay with style name */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={componentStyles.labelOverlay}
        >
          <Text style={componentStyles.styleName}>{item.name}</Text>
        </LinearGradient>
        {item.paid && (
          <View style={componentStyles.proBadge}>
            <Text style={componentStyles.proBadgeText}>PRO</Text>
          </View>
        )}
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
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const { sketchImage } = route.params;
  const insets = useSafeAreaInsets();

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
          setStyles(response.data.styles);
        } else {
          throw new Error('Failed to load styles');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load styles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
  }, []);

  const handleModelSwitch = useCallback((model: ModelType) => {
    Superwall.shared.register({
      placement: 'ModelSwitch',
      feature: () => {
        setSelectedModel(model);
      }
    });
  }, []);

  const handleStyleSelect = useCallback((style: Style) => {
    Superwall.shared.register({
      placement: 'StyleSelect',
      feature: () => {
        setSelectedStyle(style.id);
      }
    });
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedStyle) {
      const style = styles.find(s => s.id === selectedStyle);
      if (style) {
        Superwall.shared.register({
          placement: 'TransformSketch',
          feature: () => {
            navigation.navigate('Transforming', {
              sketchImage,
              selectedStyle: style,
              model: selectedModel,
            });
          }
        });
      }
    }
  }, [selectedStyle, styles, navigation, sketchImage, selectedModel]);

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
      {/* Sketch and rest of UI */}
      <View style={containerStyle.sketchContainer}>
        <View style={containerStyle.sketchWrapper}>
          <Image
            source={{ uri: `data:image/png;base64,${sketchImage}` }}
            style={containerStyle.sketchImage}
            resizeMode="contain"
          />
        </View>
        {/* Single compact instruction */}
        <Text style={containerStyle.toggleInstruction}>
          Select a model and style to transform your sketch
        </Text>
        {/* Modern pill/segmented toggle */}
        <View style={containerStyle.modelToggleWrapper}>
          {MODEL_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                containerStyle.modelToggleButton,
                selectedModel === option.value && containerStyle.modelToggleButtonActive
              ]}
              onPress={() => handleModelSwitch(option.value as ModelType)}
              activeOpacity={0.85}
            >
              <Text style={[
                containerStyle.modelToggleText,
                selectedModel === option.value && containerStyle.modelToggleTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
          <ActionButton
            onPress={handleContinue}
            text="Transform Sketch"
            icon="arrow-forward"
            size="large"
            variant="primary"
          />
        ) : (
          <ActionButton
            onPress={() => {}}
            text="Transform Sketch"
            icon="arrow-forward"
            size="large"
            variant="primary"
            disabled
          />
        )}
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <LinearGradient colors={GRADIENT_COLORS.PRIMARY} style={{ flex: 1 }}>
        <SafeAreaView style={containerStyle.container}>
          <View style={containerStyle.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.WHITE} />
            <Text style={containerStyle.loadingText}>Loading styles...</Text>
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

const containerStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  modelToggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf6ff',
    borderRadius: 24,
    padding: 4,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  modelToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelToggleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  modelToggleText: {
    fontSize: 15,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  modelToggleTextActive: {
    color: COLORS.TEXT.LIGHT,
    fontWeight: '700',
  },
  toggleInstruction: {
    fontSize: 13,
    color: '#7a8fa6',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.1,
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
    height: cardWidth * 1.1,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  proBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  proBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default StyleSelectionScreen;