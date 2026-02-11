import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={24} color={Colors.orange} />
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>day streak!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orangeLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  count: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.orange,
    marginLeft: Spacing.xs,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.orange,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
});
