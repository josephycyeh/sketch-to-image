import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT_COLORS } from '../../constants/theme';

type ButtonSize = 'small' | 'medium' | 'large';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BUTTON_SIZES: Record<ButtonSize, { 
  height: number; 
  width: number;
  fontSize: number; 
  iconSize: number 
}> = {
  small: { height: 40, width: SCREEN_WIDTH * 0.3, fontSize: 14, iconSize: 18 },
  medium: { height: 60, width: SCREEN_WIDTH * 0.4, fontSize: 18, iconSize: 24 },
  large: { height: 56, width: SCREEN_WIDTH * 0.85, fontSize: 18, iconSize: 24 },
};

interface ActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  text: string;
  size?: ButtonSize;
  variant?: 'primary' | 'secondary' | 'action';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  icon,
  text,
  size = 'medium',
  variant = 'secondary',
  disabled = false,
}) => {
  const { height, width, fontSize, iconSize } = BUTTON_SIZES[size];
  let gradientColors: readonly [string, string] = variant === 'primary' ? GRADIENT_COLORS.PRIMARY : GRADIENT_COLORS.SECONDARY;
  
  if (variant === 'action') {
    gradientColors = GRADIENT_COLORS.ACTION;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        { width, opacity: disabled ? 0.6 : 1 }
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradientContent,
          { height }
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={COLORS.TEXT.LIGHT}
            style={styles.icon}
          />
        )}
        <Text style={[
          styles.text,
          { fontSize }
        ]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.TEXT.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 6,
  },
  gradientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: COLORS.TEXT.LIGHT,
    fontWeight: '600',
  }
});

export default ActionButton; 