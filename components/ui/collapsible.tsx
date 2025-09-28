import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: { children: React.ReactNode; title: string }) {
  const [isOpen, setIsOpen] = (React as any).useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value: boolean) => !value)}
        activeOpacity={0.8}>
        <Text style={{ 
          fontSize: 18, 
          color: theme === 'light' ? Colors.light.icon : Colors.dark.icon,
        }}>
          {isOpen ? '▼' : '▶'}
        </Text>

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
