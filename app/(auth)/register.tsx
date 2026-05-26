import { registerUser } from '@/api';
import { saveSessionUser } from '@/src/session';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const logo = require('@/assets/images/logo.png');
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill in full name, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      console.log('register response', res);
      if (res?.success) {
        if (res.data) {
          try {
            await saveSessionUser(res.data as any);
          } catch (err: any) {
            console.warn('Failed to save session user', err?.message || err);
          }
        }
        alert('Account created successfully.');
        router.replace('/(tabs)/home');
      } else {
        alert(res?.message || JSON.stringify(res) || 'Failed to create account.');
      }
    } catch (e) {
      console.error('register error', e);
      const msg = (e as any)?.message || String(e);
      alert('Unable to register right now. ' + msg + ' — check backend/API URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior="padding">
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <AnimatedImage
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>REGISTER</Text>
          <Text style={styles.subtitle}>Please sign up to access the app</Text>
        </Animated.View>

        <Animated.View style={styles.form} entering={FadeInUp.delay(400).duration(800)}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            placeholder="Enter your full name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter a password"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
              <Text style={styles.showButtonText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSignUp}
            style={styles.button}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)}>
          <Link href="/login" style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </Link>
        </Animated.View>
      </KeyboardAvoidingView>
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
  inner: {
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
    marginTop: 40,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    gap: 18,
    backgroundColor: '#f8f8f8',
    padding: 28,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 1.5,
  },
  input: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    fontSize: 16,
    color: '#1a1a2e',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  passwordContainer: {
    position: 'relative',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  showButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d4c35a',
  },
  button: {
    marginTop: 12,
    paddingVertical: 20,
    backgroundColor: '#d4c35a',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  link: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  linkText: {
    color: '#d4c35a',
    fontSize: 16,
    fontWeight: '600',
  },
});
