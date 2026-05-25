import { ImageBackground, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const background = require('@/assets/images/react-logo.png');

export default function LandingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ImageBackground source={background} style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.overlay} />
        <ThemedView style={styles.content}>
          <View style={styles.hero}>            
            <View style={styles.logoFrame}>
              <ThemedText style={styles.logoText}>HV</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              HilkVisuals
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Capture unforgettable moments with a polished, photo-first experience.
            </ThemedText>
          </View>

          <Link href="/login" style={styles.primaryButton}>
            <ThemedText type="subtitle" style={styles.primaryButtonText}>
              GET STARTED
            </ThemedText>
          </Link>

          <Link href="/register" style={styles.secondaryButton}>
            <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
              CREATE AN ACCOUNT
            </ThemedText>
          </Link>

          <View style={styles.gallery}>
            <View style={[styles.photo, styles.photoOne]} />
            <View style={[styles.photo, styles.photoTwo]} />
            <View style={[styles.photo, styles.photoThree]} />
          </View>
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
    opacity: 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  hero: {
    gap: 16,
    marginTop: 48,
  },
  logoFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignSelf: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 3,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 26,
  },
  primaryButton: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4c35a',
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#1f1f1f',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  secondaryButtonText: {
    color: '#222',
  },
  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 32,
  },
  photo: {
    flex: 1,
    aspectRatio: 0.8,
    borderRadius: 20,
  },
  photoOne: {
    backgroundColor: '#e4b8b8',
  },
  photoTwo: {
    backgroundColor: '#c7d6e7',
  },
  photoThree: {
    backgroundColor: '#d5e4c7',
  },
});
