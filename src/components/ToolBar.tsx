// src/components/Toolbar.tsx
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import ToolButton from './ToolButton';
import ColorPickerModal from './ColorPickerModal';
import { DrawingContext } from '../context/DrawingContext';

const Toolbar: React.FC = () => {
  const { state, dispatch } = useContext(DrawingContext);
  const { currentTool, currentColor, currentStrokeWidth } = state;
  const [showColor, setShowColor] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ToolButton
          iconName="brush"
          onPress={() =>
            dispatch({
              type: 'SET_TOOL',
              tool: 'brush',
            })
          }
          active={currentTool === 'brush'}
        />
        <ToolButton
          iconName="eraser"
          onPress={() =>
            dispatch({
              type: 'SET_TOOL',
              tool: 'eraser',
            })
          }
          active={currentTool === 'eraser'}
        />
        <ToolButton
          iconName="arrow-undo"
          onPress={() => dispatch({ type: 'UNDO' })}
        />
        <ToolButton
          iconName="arrow-redo"
          onPress={() => dispatch({ type: 'REDO' })}
        />
        <ToolButton
          iconName="trash"
          onPress={() => dispatch({ type: 'CLEAR' })}
        />
        <ToolButton
          iconName="color-palette"
          onPress={() => setShowColor(true)}
        />
      </View>
      <View style={styles.sliderRow}>
        <Text style={styles.label}>Size</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={currentStrokeWidth}
          onValueChange={(w) =>
            dispatch({ type: 'SET_STROKE_WIDTH', width: w })
          }
          minimumTrackTintColor={currentColor}
          maximumTrackTintColor="#444"
          thumbTintColor={currentColor}
        />
      </View>

      <ColorPickerModal
        visible={showColor}
        selectedColor={currentColor}
        onSelect={(c) => {
          dispatch({ type: 'SET_COLOR', color: c });
          setShowColor(false);
        }}
        onClose={() => setShowColor(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(28,28,28,0.9)',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    color: '#EEE',
    marginRight: 10,
    width: 30,
  },
  slider: { flex: 1, height: 40 },
});

export default Toolbar;
