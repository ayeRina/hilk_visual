import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const logo = require('@/assets/images/logo.png');
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Animated.View style={styles.content} entering={FadeInUp.duration(1000)}>
        <Animated.View style={styles.header} entering={FadeInDown.delay(200).duration(800)}>
          <AnimatedImage
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>HilkVisuals</Text>
          <Text style={styles.subtitle}>Capture unforgettable moments with a polished, photo-first experience.</Text>
        </Animated.View>

        <View style={styles.buttons}>
          <Animated.View entering={FadeInUp.delay(600).duration(800)}>
            <Link href="/login" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>GET STARTED</Text>
              </Pressable>
            </Link>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <Link href="/register" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>CREATE AN ACCOUNT</Text>
              </Pressable>
            </Link>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 48,
    width: '100%',
    maxWidth: 480,
  },
  header: {
    gap: 20,
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 280,
    height: 280,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  buttons: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 20,
    backgroundColor: '#d4c35a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderWidth: 2,
    borderColor: '#d4c35a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 195, 90, 0.08)',
  },
  secondaryButtonText: {
    color: '#d4c35a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
