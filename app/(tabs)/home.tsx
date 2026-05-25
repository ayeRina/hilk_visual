import { Pressable, ScrollView, StyleSheet, View, Image, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const padding = 24;
const gap = 16;
const cardWidth = (screenWidth - padding * 2 - gap) / 2;

const logo = require('@/assets/images/logo.png');
const AnimatedImage = Animated.createAnimatedComponent(Image);

const cards = [
  { 
    title: 'Book Photoshoots', 
    note: 'Choose your package', 
    color: '#f1d8d0',
    icon: 'camera.fill'
  },
  { 
    title: 'Choose a Date', 
    note: 'Select a shoot day', 
    color: '#dee8f6',
    icon: 'calendar'
  },
  { 
    title: 'Pick a Time', 
    note: 'Morning or evening', 
    color: '#e6f4de',
    icon: 'clock.fill'
  },
  { 
    title: 'View Gallery', 
    note: 'See your saved shots', 
    color: '#f4e5c8',
    icon: 'photo.on.rectangle.angled'
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <View style={styles.headerLeft}>
            <AnimatedImage
              source={logo}
              style={styles.smallLogo}
              resizeMode="contain"
            />
            <View style={styles.headerText}>
              <ThemedText style={styles.greetingSmall}>WELCOME BACK</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.greeting}>
                Luxxkey Smith
              </ThemedText>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <IconSymbol size={22} name="bell.fill" color="#d4c35a" />
          </View>
        </Animated.View>

        <Animated.View style={styles.featuredCard} entering={FadeInDown.delay(200).duration(800)}>
          <ThemedText type="title" style={styles.featuredTitle}>Capture Your Moments</ThemedText>
          <ThemedText style={styles.featuredSubtitle}>Book a professional photoshoot today</ThemedText>
          <View style={styles.featuredRow}>
            <Pressable style={styles.featuredButton}>
              <ThemedText type="subtitle" style={styles.featuredButtonText}>
                EXPLORE
              </ThemedText>
            </Pressable>
            <IconSymbol size={40} name="camera.aperture" color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <Animated.View 
                key={card.title} 
                style={[styles.card, { backgroundColor: card.color }]}
                entering={FadeInUp.delay(500 + index * 100).duration(600)}>
                <View style={styles.cardIcon}>
                  <IconSymbol size={32} name={card.icon} color="#1a1a2e" />
                </View>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  {card.title}
                </ThemedText>
                <ThemedText style={styles.cardNote}>{card.note}</ThemedText>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={styles.bookingSection} entering={FadeInUp.delay(900).duration(800)}>
          <ThemedText type="subtitle" style={styles.bookingTitle}>Ready to Shoot?</ThemedText>
          <Pressable style={styles.button}>
            <ThemedText type="subtitle" style={styles.buttonText}>
              BOOK NOW
            </ThemedText>
            <IconSymbol size={20} name="arrow.right" color="#1a1a2e" />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: { 
    padding: 24, 
    gap: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  smallLogo: {
    width: 60,
    height: 60,
  },
  headerText: {
    gap: 4,
  },
  greetingSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 1,
  },
  greeting: { 
    fontSize: 22, 
    letterSpacing: 0.2,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 195, 90, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 28,
    padding: 28,
    gap: 12,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  featuredTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    lineHeight: 22,
  },
  featuredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  featuredButton: {
    backgroundColor: '#d4c35a',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  featuredButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    minHeight: 160,
    borderRadius: 24,
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  cardNote: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  bookingSection: {
    gap: 16,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  button: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    paddingVertical: 20,
    borderRadius: 22,
    backgroundColor: '#d4c35a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
