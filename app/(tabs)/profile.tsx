import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const profileOptions = [
  { title: 'Edit Profile', icon: 'person', color: '#f1d8d0' },
  { title: 'About Us', icon: 'info', color: '#dee8f6' },
  { title: 'Help', icon: 'questionmark', color: '#e6f4de' },
  { title: 'Logout', icon: 'arrow.right', color: '#f4e5c8' },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleOptionPress = (option: typeof profileOptions[0]) => {
    if (option.title === 'Logout') {
      router.replace('/(auth)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <ThemedText type="title" style={styles.title}>Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your account settings and personal details.
          </ThemedText>
        </Animated.View>

        <Animated.View style={styles.profileCard} entering={FadeInDown.delay(200).duration(800)}>
          <View style={styles.avatar}>
            <IconSymbol size={48} name="person" color="#ffffff" />
          </View>
          <ThemedText type="subtitle" style={styles.userName}>
            Luxxkey Smith
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            luxxkey@example.com
          </ThemedText>
        </Animated.View>

        <Animated.View style={styles.optionsContainer} entering={FadeInUp.delay(400).duration(800)}>
          <ThemedText type="subtitle" style={styles.optionsTitle}>
            Account Settings
          </ThemedText>
          {profileOptions.map((option, index) => (
            <Animated.View
              key={option.title}
              entering={FadeInUp.delay(500 + index * 100).duration(600)}>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}>
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <IconSymbol size={24} name={option.icon} color="#1a1a2e" />
                </View>
                <ThemedText type="subtitle" style={styles.optionTitle}>
                  {option.title}
                </ThemedText>
                <IconSymbol size={20} name="chevron.right" color="#999999" />
              </Pressable>
            </Animated.View>
          ))}
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
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  profileCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#d4c35a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
  },
  optionsContainer: {
    gap: 12,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
