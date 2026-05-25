import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText style={styles.body}>Manage your account settings and personal details.</ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">Luxxkey Smith</ThemedText>
        <ThemedText>Email: luxxkey@example.com</ThemedText>
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
