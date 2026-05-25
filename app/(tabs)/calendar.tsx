import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Calendar</ThemedText>
      <ThemedText style={styles.body}>
        Choose a shoot date and time for your next session.
      </ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">May 2026</ThemedText>
        <ThemedText>Book your next photoshoot in one tap.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  body: { marginTop: 12, lineHeight: 22 },
  card: {
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
  },
});
