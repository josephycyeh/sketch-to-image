import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

const STYLES: StyleOption[] = [
  {
    id: '1',
    name: 'Watercolor',
    description: 'Soft, flowing watercolor artistic style',
    icon: 'water',
    color: '#4FACFE',
    backgroundColor: '#E3F2FD',
  },
  {
    id: '2',
    name: 'Oil Painting',
    description: 'Rich, textured classical oil painting',
    icon: 'color-palette',
    color: '#FF5E3A',
    backgroundColor: '#FFF0ED',
  },
  {
    id: '3',
    name: 'Anime',
    description: 'Japanese animation style artwork',
    icon: 'happy',
    color: '#FF2D55',
    backgroundColor: '#FFE9EE',
  },
  {
    id: '4',
    name: 'Digital Art',
    description: 'Modern digital illustration style',
    icon: 'desktop',
    color: '#5856D6',
    backgroundColor: '#EEEEFF',
  },
  {
    id: '5',
    name: 'Pencil Sketch',
    description: 'Detailed pencil drawing style',
    icon: 'pencil',
    color: '#34C759',
    backgroundColor: '#EDFFF1',
  },
  {
    id: '6',
    name: 'Pop Art',
    description: 'Bold, vibrant pop art style',
    icon: 'star',
    color: '#FF9500',
    backgroundColor: '#FFF6E9',
  },
  {
    id: '7',
    name: 'Pixel Art',
    description: 'Retro-style pixel artwork',
    icon: 'grid',
    color: '#BF5AF2',
    backgroundColor: '#F7EDFF',
  },
  {
    id: '8',
    name: 'Comic Style',
    description: 'Bold comic book illustration style',
    icon: 'book',
    color: '#FF375F',
    backgroundColor: '#FFE8EC',
  },
];

const { width } = Dimensions.get('window');
const PADDING = 16;
const CARD_MARGIN = 8;
const COLUMN_COUNT = 2;
const TOTAL_HORIZONTAL_PADDING = PADDING * 2 + CARD_MARGIN * 2 * COLUMN_COUNT;
const COLUMN_WIDTH = (width - TOTAL_HORIZONTAL_PADDING) / COLUMN_COUNT;

interface StyleSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedStyle: StyleOption) => void;
}

const StyleSelectionScreen: React.FC<StyleSelectionScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);

  const renderItem = ({ item }: { item: StyleOption }) => {
    const isSelected = selectedStyle?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.styleCard,
          { backgroundColor: item.backgroundColor },
          isSelected && styles.selectedCard,
        ]}
        onPress={() => setSelectedStyle(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon as any} size={32} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.styleName}>{item.name}</Text>
          <Text style={styles.styleDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.selectedOverlay, { backgroundColor: item.color }]}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Your Style</Text>
          <Text style={styles.subtitle}>Select how you want your art to look</Text>
        </View>
      </View>

      <FlatList
        data={STYLES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedStyle && styles.continueButtonDisabled,
          ]}
          onPress={() => selectedStyle && onContinue(selectedStyle)}
          disabled={!selectedStyle}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedStyle && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={selectedStyle ? "#fff" : "#999"} 
            style={styles.continueIcon}
          />
        </TouchableOpacity>
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
    padding: PADDING,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginBottom: 8,
  },
  titleContainer: {
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: PADDING,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  styleCard: {
    width: COLUMN_WIDTH,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    padding: 16,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  styleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  buttonSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
  continueIcon: {
    marginLeft: 8,
  },
});

export default StyleSelectionScreen; 