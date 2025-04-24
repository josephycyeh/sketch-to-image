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
      <View style={styles.content}>
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
            iconName="remove-outline"
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
            maximumTrackTintColor="#D1D1D1"
            thumbTintColor={currentColor}
          />
        </View>
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  content: {
    padding: 16,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#666',
    marginRight: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  slider: { 
    flex: 1, 
    height: 40,
  },
});

export default Toolbar;
