import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT_COLORS } from '../../constants/theme';

interface CircleButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  gradient?: boolean;
  color?: string;
  gradientColors?: [string, string];
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  icon,
  size = 36,
  gradient = false,
  color = COLORS.PRIMARY,
  gradientColors = GRADIENT_COLORS.PRIMARY,
  style,
  disabled = false,
}) => {
  const buttonStyles = [
    styles.button,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: gradient ? 'transparent' : color,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const iconSize = size * 0.5;

  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={buttonStyles}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientContent, { borderRadius: size / 2 }]}
        >
          <Ionicons
            name={icon}
            size={iconSize}
            color={COLORS.TEXT.LIGHT}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={buttonStyles}
    >
      <Ionicons
        name={icon}
        size={iconSize}
        color={COLORS.TEXT.LIGHT}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.TEXT.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradientContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircleButton; 