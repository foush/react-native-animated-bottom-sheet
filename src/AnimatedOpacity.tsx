import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';

interface Props {
  isVisible: boolean;
  onShowStart?: (animation: Animated.CompositeAnimation) => boolean;
  onHideStart?: (
    animation: Animated.CompositeAnimation,
    onCompleted: () => void
  ) => boolean;
  onShowComplete?: () => void;
  onHideComplete?: () => void;
  maxOpacity: number;
  children?: React.ReactElement;
  style?: ViewStyle;
}

function emptyFn() {}

const defaultStart = () => true;

export default function AnimatedOpacity({
  isVisible,
  onShowComplete = emptyFn,
  onHideComplete = emptyFn,
  maxOpacity,
  children,
  onShowStart = defaultStart,
  onHideStart = defaultStart,
  style: propStyle,
}: Props) {
  const visibleRef = useRef(isVisible);
  const [isShown, setIsShown] = useState(isVisible);
  const fadeAnim = useRef(
    new Animated.Value(isVisible ? maxOpacity : 0)
  ).current;
  const fadeIn = useMemo(
    () => () => {
      setIsShown(true);
      const anim = Animated.timing(fadeAnim, {
        toValue: maxOpacity,
        duration: 500,
        useNativeDriver: true,
      });
      if (onShowStart(anim)) {
        anim.start(onShowComplete);
      }
    },
    []
  );
  const fadeOut = useMemo(
    () => () => {
      const anim = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });
      const onAnimationCompleted = () => {
        setIsShown(false);
        onHideComplete();
      };
      if (onHideStart(anim, onHideComplete)) {
        anim.start(onAnimationCompleted);
      }
    },
    []
  );
  useEffect(() => {
    if (visibleRef.current === isVisible) {
      return;
    }
    visibleRef.current = isVisible;
    if (isVisible) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [isVisible]);
  if (!isShown) {
    return null;
  }
  return (
    <Animated.View style={[styles.container, propStyle, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
