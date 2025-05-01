import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT_COLORS } from '../constants/theme';

interface ActionButtonProps {
  onPress: () => void;
  icon?: {
    name: keyof typeof Ionicons.glyphMap;
    size?: number;
  };
  text: string;
  gradient?: boolean;
  gradientColors?: [string, string];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  icon,
  text,
  gradient = false,
  gradientColors = GRADIENT_COLORS.SECONDARY as [string, string],
  style,
  textStyle,
  disabled = false,
}) => {
  const ButtonContent = () => (
    <>
      {icon && (
        <Ionicons
          name={icon.name}
          size={icon.size || 22}
          color={COLORS.TEXT.LIGHT}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS.SECONDARY,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: COLORS.TEXT.LIGHT,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ActionButton; 