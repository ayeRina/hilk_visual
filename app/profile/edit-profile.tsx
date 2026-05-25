import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Luxxkey Smith');
  const [email, setEmail] = useState('luxxkey@example.com');
  const [changePassword, setChangePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>Edit Profile</ThemedText>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View style={styles.avatarSection} entering={FadeInDown.delay(200).duration(800)}>
          <View style={styles.avatar}>
            <IconSymbol size={48} name="person" color="#ffffff" />
          </View>
          <Pressable style={styles.changePhotoButton}>
            <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Change Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="rgba(102, 102, 102, 0.6)"
              value={changePassword}
              onChangeText={setChangePassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="rgba(102, 102, 102, 0.6)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </Animated.View>

        <Animated.View style={styles.submitSection} entering={FadeInUp.delay(600).duration(800)}>
          <Pressable style={styles.submitButton} onPress={() => {
            if (changePassword && changePassword !== confirmPassword) {
              alert('Passwords do not match!');
              return;
            }
            alert('Profile updated successfully!');
            router.back();
          }}>
            <ThemedText type="subtitle" style={styles.submitButtonText}>
              SAVE CHANGES
            </ThemedText>
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
  avatarSection: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d4c35a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  changePhotoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(212, 195, 90, 0.15)',
    borderRadius: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d4c35a',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#1a1a2e',
  },
  submitSection: {
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 20,
    backgroundColor: '#d4c35a',
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  submitButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
