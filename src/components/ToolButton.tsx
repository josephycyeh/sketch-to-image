// src/components/ToolButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToolButtonProps {
  iconName: any; // Ionicons name
  onPress: () => void;
  active?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  iconName,
  onPress,
  active = false,
}) => {
  return (
  <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
    onPress={onPress}
  >
    <Ionicons
      name={iconName}
      size={24}
        color={active ? '#007AFF' : '#333'}
    />
  </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  activeButton: {
    backgroundColor: '#E8F1FF',
  },
});

export default ToolButton;
