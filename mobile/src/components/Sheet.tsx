import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { COLORS, SPACING } from '../theme/tokens';

interface Props {
  children: ReactNode;
  onClose: () => void;
  /** Fixed snap points (e.g. ['50%', '90%']) for scrollable content. Omit for content that sizes itself. */
  snapPoints?: (string | number)[];
  /** Skip the default horizontal padding — for content with full-bleed media at the top. */
  noPadding?: boolean;
}

// Shared bottom-sheet shell (drag-to-dismiss, backdrop, theme) used by
// HistoryModal, ProfileModal and ExerciseDetailModal — replaces the plain
// RN <Modal> + backdrop <Pressable> pattern from earlier phases with a real
// native-feeling sheet (@gorhom/bottom-sheet). Presents itself on mount;
// the parent controls visibility by conditionally rendering this component,
// same as before.
export function Sheet({ children, onClose, snapPoints, noPadding }: Props) {
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    ref.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.65}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onClose}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={snapPoints ? styles.flexContent : noPadding ? undefined : styles.content}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: COLORS.surf,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: COLORS.line,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: SPACING.xl,
  },
  flexContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
