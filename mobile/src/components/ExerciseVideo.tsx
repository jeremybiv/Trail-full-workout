import { StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { exerciseVideoUrl } from '../config';

interface Props {
  url: string;
  autoPlay?: boolean;
}

export function ExerciseVideo({ url, autoPlay }: Props) {
  const player = useVideoPlayer(exerciseVideoUrl(url), (p) => {
    p.loop = true;
    if (autoPlay) {
      p.muted = true;
      p.play();
    }
  });

  return (
    <VideoView
      style={styles.video}
      player={player}
      nativeControls
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 10,
  },
});
