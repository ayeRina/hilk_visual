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

export default function LoginScreen() {
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
              LOGIN
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Please sign in to continue
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.formCard}>
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
                placeholder="Enter your password"
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
                SIGN IN
              </ThemedText>
            </Pressable>

            <ThemedView style={styles.rememberRow}>
              <View style={styles.checkbox} />
              <ThemedText>Remember me</ThemedText>
            </ThemedView>
          </ThemedView>

          <Link href="/register" style={styles.bottomLink}>
            <ThemedText type="link">Don’t have an account? Sign up</ThemedText>
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
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#d4c35a',
  },
  actionButtonText: {
    color: '#1a1a1a',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
  },
  bottomLink: {
    alignSelf: 'center',
    marginBottom: 18,
    paddingVertical: 12,
  },
});
