import useValueChangeObserver from './useValueChangeObserver';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import AnimatedOpacity from './AnimatedOpacity';
import AnimatedViewFromBottom from './AnimatedViewFromBottom';

interface Props {
  isVisible: boolean;
  onShowComplete?: () => void;
  onHideComplete: () => void;
  heightRatio?: number;
  opacity?: number;
  children: React.ReactElement;
}

const DEFAULT_RATIO = 0.6;
const DEFAULT_OPACITY = 0.5;

function getTopAndHeight(
  windowHeight: number,
  ratio: number
): { top: number; height: number } {
  if (ratio > 1.0 || ratio < 0.0) {
    throw new Error('Invalid ratio value' + ratio);
  }
  const height = ratio * windowHeight;
  const top = (1 - ratio) * windowHeight;
  return { top, height };
}

function emptyFn() {}

export default function BasicBottomSheet({
  isVisible,
  onShowComplete = emptyFn,
  onHideComplete,
  heightRatio = DEFAULT_RATIO,
  opacity = DEFAULT_OPACITY,
  children,
}: Props) {
  const [isShown, setIsShown] = useState(isVisible);
  useValueChangeObserver(isVisible, setIsShown);
  const { height: windowHeight } = useWindowDimensions();
  const { top, height } = getTopAndHeight(windowHeight, heightRatio);
  if (!isVisible) {
    return null;
  }
  return (
    <Modal transparent={true} presentationStyle="fullScreen">
      <AnimatedOpacity
        isVisible={isShown}
        onShowComplete={onShowComplete}
        onHideComplete={onHideComplete}
        maxOpacity={opacity}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setIsShown(false)}
        />
      </AnimatedOpacity>
      <AnimatedViewFromBottom
        height={height}
        top={top}
        isVisible={isShown}
        style={styles.container}
      >
        {children}
      </AnimatedViewFromBottom>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 10,
  },
});
