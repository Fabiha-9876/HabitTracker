import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function HabitCheckbox({ label, checked, onToggle, icon }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.container, checked && styles.checked]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={checked ? Colors.primary : Colors.textSecondary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginVertical: 2,
  },
  checked: {
    backgroundColor: Colors.primaryLight + '15',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.text,
    flex: 1,
  },
  labelChecked: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
