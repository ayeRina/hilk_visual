import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function FileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">File Storage</ThemedText>
      <ThemedText style={styles.body}>
        Manage your shoot files, receipts, and reference images in one place.
      </ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">My Files</ThemedText>
        <ThemedText>3.1 GB used</ThemedText>
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
