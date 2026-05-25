import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const background = require('@/assets/images/react-logo.png');

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ImageBackground source={background} style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ThemedView style={styles.header}>
            <View style={styles.logoFrame}>
              <ThemedText style={styles.logoText}>HV</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              REGISTER
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Please sign up to access the app
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.formCard}>
            <ThemedText style={styles.fieldLabel}>FULL NAME</ThemedText>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="rgba(0,0,0,0.4)"
              autoCapitalize="words"
              style={styles.input}
            />

            <ThemedText style={styles.fieldLabel}>EMAIL</ThemedText>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="rgba(0,0,0,0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <ThemedText style={styles.fieldLabel}>PASSWORD</ThemedText>
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Enter a password"
                placeholderTextColor="rgba(0,0,0,0.4)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.input}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)} style={styles.showButton}>
                <ThemedText style={styles.showButtonText}>{showPassword ? 'HIDE' : 'SHOW'}</ThemedText>
              </Pressable>
            </View>

            <Pressable style={styles.actionButton} onPress={() => {}}>
              <ThemedText type="subtitle" style={styles.actionButtonText}>
                SIGN UP
              </ThemedText>
            </Pressable>
          </ThemedView>

          <Link href="/login" style={styles.bottomLink}>
            <ThemedText type="link">Already have an account? Sign in</ThemedText>
          </Link>
        </KeyboardAvoidingView>
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
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 28,
  },
  header: {
    gap: 12,
    alignItems: 'center',
  },
  logoFrame: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    letterSpacing: 1.5,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  formCard: {
    borderRadius: 24,
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    gap: 14,
  },
  fieldLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#333',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f7f7f7',
    color: '#111',
  },
  passwordRow: {
    gap: 12,
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  showButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8a8a8a',
  },
  actionButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#d4c35a',
  },
  actionButtonText: {
    color: '#1a1a1a',
  },
  bottomLink: {
    alignSelf: 'center',
    marginBottom: 18,
    paddingVertical: 12,
  },
});
