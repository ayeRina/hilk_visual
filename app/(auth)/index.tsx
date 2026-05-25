import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.backgroundGradient}>
        <Animated.View 
          style={styles.content}
          entering={FadeInUp.duration(1000).springify()}>
          <View style={styles.hero}>
            <Animated.View 
              style={styles.logoFrame}
              entering={FadeInDown.delay(200).duration(800).springify()}>
              <ThemedText style={styles.logoText}>HV</ThemedText>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(400).duration(800)}>
              <ThemedText type="title" style={styles.title}>
                HilkVisuals
              </ThemedText>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(600).duration(800)}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Capture unforgettable moments with a polished, photo-first experience.
              </ThemedText>
            </Animated.View>
          </View>

          <View style={styles.buttonsContainer}>
            <Animated.View entering={FadeInUp.delay(800).duration(800)}>
              <Link href="/login" asChild>
                <Pressable style={styles.primaryButton}>
                  <ThemedText type="subtitle" style={styles.primaryButtonText}>
                    GET STARTED
                  </ThemedText>
                </Pressable>
              </Link>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1000).duration(800)}>
              <Link href="/register" asChild>
                <Pressable style={styles.secondaryButton}>
                  <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
                    CREATE AN ACCOUNT
                  </ThemedText>
                </Pressable>
              </Link>
            </Animated.View>
          </View>

          <Animated.View 
            style={styles.gallery}
            entering={FadeInUp.delay(1200).duration(800)}>
            <View style={[styles.photo, styles.photoOne]} />
            <View style={[styles.photo, styles.photoTwo]} />
            <View style={[styles.photo, styles.photoThree]} />
          </Animated.View>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 480,
  },
  hero: {
    gap: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  logoFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#d4c35a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 195, 90, 0.15)',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#d4c35a',
  },
  title: {
    textAlign: 'center',
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4c35a',
    borderRadius: 20,
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  secondaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d4c35a',
    borderRadius: 20,
    backgroundColor: 'rgba(212, 195, 90, 0.08)',
  },
  secondaryButtonText: {
    color: '#d4c35a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 40,
  },
  photo: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  photoOne: {
    backgroundColor: 'rgba(228, 184, 184, 0.9)',
  },
  photoTwo: {
    backgroundColor: 'rgba(199, 214, 231, 0.9)',
  },
  photoThree: {
    backgroundColor: 'rgba(213, 228, 199, 0.9)',
  },
});
