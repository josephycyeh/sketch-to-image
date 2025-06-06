import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StyleSelectionHeaderProps {
  onBack: () => void;
  style?: any;
}

const StyleSelectionHeader: React.FC<StyleSelectionHeaderProps> = ({ onBack, style }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={['#4A90E2', '#50E3C2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.header,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight,
        },
        style
      ]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Image 
            source={require('../../assets/utils/arrow.backward.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Style</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 120
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    resizeMode: 'contain'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  placeholder: {
    width: 40,
  },
});

export default StyleSelectionHeader; 