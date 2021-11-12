import useValueChangeObserver from './useValueChangeObserver';
import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Animated,
  ViewStyle,
} from 'react-native';

export type CreateAnimationFn = (
  value: Animated.Value
) => Animated.CompositeAnimation;

export type AnimationFn = (
  value: Animated.Value,
  defaultCreate: CreateAnimationFn
) => Promise<void>;

interface Props {
  isVisible: boolean;
  onShowComplete?: () => void;
  onHideComplete?: () => void;
  height: number;
  top: number;
  verticalOffset?: number;
  children: React.ReactElement;
  getAnimationForOpen?: CreateAnimationFn;
  getAnimationForClose?: CreateAnimationFn;
  animateOpen?: AnimationFn;
  animateClose?: AnimationFn;
  style?: Omit<ViewStyle, 'position'>;
}

function emptyFn() {}

export default function AnimatedViewFromBottom({
  isVisible,
  onShowComplete = emptyFn,
  onHideComplete = emptyFn,
  height,
  top,
  children,
  verticalOffset = 0,
  style: propStyle,
  getAnimationForOpen,
  getAnimationForClose,
  animateOpen,
  animateClose,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();

  const visibleRef = useRef(isVisible);
  const [isShown, setIsShown] = useState(isVisible);

  const topWhenShown = top - verticalOffset;
  const topWhenHidden = windowHeight - verticalOffset;

  const getOpenAnimation = useMemo(
    () =>
      getAnimationForOpen ??
      ((v: Animated.Value) =>
        Animated.timing(v, {
          toValue: topWhenShown,
          duration: 500,
          useNativeDriver: false,
        })),
    [getAnimationForOpen]
  );

  const getCloseAnimation = useMemo(
    () =>
      getAnimationForClose ??
      ((v: Animated.Value) =>
        Animated.timing(v, {
          toValue: topWhenHidden,
          duration: 200,
          useNativeDriver: false,
        })),
    [getAnimationForClose]
  );

  const moveAnim = useRef(
    new Animated.Value(isVisible ? topWhenShown : topWhenHidden)
  ).current;

  // const animateOpen = useMemo(() => () => {}, []);
  const open = useMemo(
    () => () => {
      setIsShown(true);
      if (animateOpen != null) {
        animateOpen(moveAnim, getOpenAnimation).then(() => onShowComplete());
      } else {
        getOpenAnimation(moveAnim).start(onShowComplete);
      }
    },
    [animateOpen, getOpenAnimation, onShowComplete]
  );
  const close = useMemo(
    () => () => {
      const afterClose = () => {
        setIsShown(false);
        visibleRef.current = false;
        onHideComplete();
      };
      if (animateClose != null) {
        animateClose(moveAnim, getCloseAnimation).then(afterClose);
      } else {
        getCloseAnimation(moveAnim).start(afterClose);
      }
    },
    []
  );
  useValueChangeObserver(isVisible, (value: boolean) => {
    if (value) {
      open();
    } else {
      close();
    }
  });
  if (!isShown) {
    return null;
  }
  return (
    <Animated.View
      style={[styles.container, { top: moveAnim, height }, propStyle]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
  },
});
