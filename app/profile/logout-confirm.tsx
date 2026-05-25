import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.content} entering={FadeInDown.duration(800)}>
        <View style={styles.iconCircle}>
          <IconSymbol size={48} name="person" color="#ffffff" />
        </View>

        <ThemedText type="title" style={styles.title}>Log Out?</ThemedText>
        <ThemedText style={styles.subtitle}>
          Are you sure you want to log out of your account? You will need to sign in again to access your account.
        </ThemedText>

        <Animated.View style={styles.buttons} entering={FadeInUp.delay(400).duration(800)}>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </Pressable>
          <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#d4c35a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
  },
  logoutButton: {
    backgroundColor: '#d4c35a',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
  },
});
