// src/components/ToolButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

interface ToolButtonProps {
  iconName: string;
  onPress: () => void;
  active?: boolean;
}

const iconMap = {
  'brush': require('../../assets/utils/paintbrush.pointed.fill.png'),
  'remove-outline': require('../../assets/utils/eraser.fill.png'),
  'arrow-undo': require('../../assets/utils/arrow.uturn.backward.png'),
  'arrow-redo': require('../../assets/utils/arrow.uturn.forward.png'),
  'trash': require('../../assets/utils/trash.fill.png'),
  'color-palette': require('../../assets/utils/paintpalette.fill.png'),
} as const;

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
      <Image
        source={iconMap[iconName as keyof typeof iconMap]}
        style={[
          styles.icon,
          { tintColor: active ? '#007AFF' : '#333' }
        ]}
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
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  }
});

export default ToolButton;
