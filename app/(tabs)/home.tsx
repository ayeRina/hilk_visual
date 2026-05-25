import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const cards = [
  { title: 'Book Photoshoots', note: 'Choose your package', color: '#f1d8d0' },
  { title: 'Choose a Date', note: 'Select a shoot day', color: '#dee8f6' },
  { title: 'Pick a Time', note: 'Morning or evening', color: '#e6f4de' },
  { title: 'View Gallery', note: 'See your saved shots', color: '#f4e5c8' },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold" style={styles.greeting}>
            WELCOME, Luxxkey Smith!
          </ThemedText>
          <View style={styles.iconCircle}>
            <IconSymbol size={22} name="chevron.right" color="#111" />
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.title} style={[styles.card, { backgroundColor: card.color }]}> 
              <ThemedText type="subtitle" style={styles.cardTitle}>
                {card.title}
              </ThemedText>
              <ThemedText>{card.note}</ThemedText>
            </View>
          ))}
        </View>

        <Pressable style={styles.button}>
          <ThemedText type="subtitle" style={styles.buttonText}>
            BOOK NOW
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 20, letterSpacing: 0.5 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    minHeight: 152,
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: '#d4c35a',
    alignItems: 'center',
  },
  buttonText: {
    color: '#111',
  },
});
