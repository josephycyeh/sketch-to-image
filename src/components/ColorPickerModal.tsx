// src/components/ColorPickerModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const SWATCHES = [
  '#000000', '#FFFFFF', '#FF3B30', '#FF9500',
  '#FFCC00', '#4CD964', '#5AC8FA', '#0579FF',
  '#5856D6', '#FF2D55', '#8E8E93', '#34C759',
  '#AF52DE', '#FFD60A', '#30B0C7', '#FF9F0A',
];

const ColorPickerModal: React.FC<Props> = ({
  visible,
  selectedColor,
  onSelect,
  onClose,
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.swatches}>
          {SWATCHES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => onSelect(c)}
              style={[
                styles.swatch,
                { backgroundColor: c },
                c === selectedColor && styles.selected,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
  },
  close: { alignSelf: 'flex-end' },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#333',
  },
});

export default ColorPickerModal;
