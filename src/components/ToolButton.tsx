// src/components/ToolButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  active?: boolean;
}

const ToolButton: React.FC<Props> = ({ iconName, onPress, active }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, active && styles.active]}
  >
    <Ionicons
      name={iconName}
      size={24}
      color={active ? '#FFF' : '#AAA'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
});

export default ToolButton;
