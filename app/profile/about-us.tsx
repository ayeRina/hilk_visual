import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'react-native';

const logo = require('@/assets/images/logo.png');

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>About Us</ThemedText>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View style={styles.logoSection} entering={FadeInDown.delay(200).duration(800)}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={styles.content} entering={FadeInUp.delay(400).duration(800)}>
          <ThemedText style={styles.paragraph}>
            Welcome to HilkVisuals, your premier destination for capturing life's most precious moments. We specialize in creating timeless memories through our professional photography services.
          </ThemedText>

          <ThemedText style={styles.paragraph}>
            With years of experience in the industry, our team of skilled photographers is dedicated to providing you with exceptional service and stunning photographs that you'll cherish for a lifetime.
          </ThemedText>

          <View style={styles.missionSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Our Mission</ThemedText>
            <ThemedText style={styles.paragraph}>
              To capture the beauty of every moment and deliver exceptional photography services that exceed our clients' expectations.
            </ThemedText>
          </View>

          <View style={styles.valuesSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Our Values</ThemedText>
            <View style={styles.valueItem}>
              <IconSymbol size={20} name="camera.fill" color="#d4c35a" />
              <ThemedText style={styles.valueText}>Quality & Excellence</ThemedText>
            </View>
            <View style={styles.valueItem}>
              <IconSymbol size={20} name="person" color="#d4c35a" />
              <ThemedText style={styles.valueText}>Client Focused</ThemedText>
            </View>
            <View style={styles.valueItem}>
              <IconSymbol size={20} name="checkmark" color="#d4c35a" />
              <ThemedText style={styles.valueText}>Integrity & Trust</ThemedText>
            </View>
          </View>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 195, 90, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  content: {
    gap: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 26,
  },
  missionSection: {
    backgroundColor: '#f8f8f8',
    padding: 24,
    borderRadius: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  valuesSection: {
    gap: 16,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
