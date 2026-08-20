import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { exercisePhotoUrl } from '../config';

interface Props {
  id: string;
  paused?: boolean;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

// Ports the web app's `ex-photo-b` CSS keyframe crossfade (3s loop:
// opacity 0 for 0–40%, ramp to 1 by 50%, hold to 90%, ramp back to 0 by 100%)
// onto a stacked pair of <Image>s using Animated.
export function ExercisePhoto({ id, paused }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    );
    return () => loopRef.current?.stop();
  }, [opacity]);

  useEffect(() => {
    if (paused) loopRef.current?.stop();
    else loopRef.current?.start();
  }, [paused]);

  return (
    <Animated.View style={styles.wrap}>
      <Image
        source={{ uri: exercisePhotoUrl(id, 0) }}
        style={styles.img}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
      />
      <AnimatedImage
        source={{ uri: exercisePhotoUrl(id, 1) }}
        style={[styles.img, { opacity }]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: '100%' },
  img: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
});
