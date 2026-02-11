import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';

interface Props {
  value: number;
  onChange: (hours: number) => void;
}

export function StudyHoursInput({ value, onChange }: Props) {
  const [text, setText] = useState(value > 0 ? String(value) : '');

  const handleBlur = () => {
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    } else {
      setText(value > 0 ? String(value) : '');
    }
  };

  const increment = (amount: number) => {
    const newVal = Math.max(0, value + amount);
    onChange(newVal);
    setText(String(newVal));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="book-outline" size={20} color={Colors.primary} style={styles.icon} />
        <Text style={styles.label}>Study Hours</Text>
      </View>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.button} onPress={() => increment(-0.5)}>
          <Ionicons name="remove" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onBlur={handleBlur}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={Colors.textMuted}
        />
        <Text style={styles.unit}>hrs</Text>
        <TouchableOpacity style={styles.button} onPress={() => increment(0.5)}>
          <Ionicons name="add" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    minWidth: 60,
    paddingHorizontal: Spacing.sm,
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
});
