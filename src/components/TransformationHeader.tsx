import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TransformationHeaderProps {
  onBack: () => void;
  title?: string;
  subtitle?: string;
  style?: any;
}

const TransformationHeader: React.FC<TransformationHeaderProps> = ({ 
  onBack, 
  title, 
  subtitle,
  style 
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View
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
          activeOpacity={0.8}
        >
          <Image 
            source={require('../../assets/utils/arrow.backward.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        <View style={styles.placeholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'transparent',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
});

export default TransformationHeader; 