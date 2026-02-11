import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';
import { TOTAL_HABITS } from '../utils/constants';

interface Props {
  completed: number;
}

export function ProgressBar({ completed }: Props) {
  const pct = Math.round((completed / TOTAL_HABITS) * 100);
  const barColor =
    pct === 100 ? Colors.success : pct >= 75 ? Colors.primaryLight : pct >= 50 ? Colors.warning : Colors.danger;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Today's Progress</Text>
        <Text style={[styles.pct, { color: barColor }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.detail}>
        {completed}/{TOTAL_HABITS} habits completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  pct: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  track: {
    height: 10,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  detail: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
