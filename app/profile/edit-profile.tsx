import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { resolveAssetUrl, updateUserProfile, uploadFile } from '@/src/api';
import { getSessionUser, saveSessionUser, type SessionUser } from '@/src/session';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function EditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pickedPhotoUri, setPickedPhotoUri] = useState<string | null>(null);
  const [pickedPhotoPath, setPickedPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const sessionUser = await getSessionUser();
      if (!mounted || !sessionUser) {
        return;
      }

      setUser(sessionUser);
      setName(sessionUser.full_name || '');
      setEmail(sessionUser.email || '');
      setPickedPhotoPath(sessionUser.profile_photo_path || null);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const displayedPhoto = pickedPhotoUri ? { uri: pickedPhotoUri } : resolveAssetUrl(pickedPhotoPath);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setPickedPhotoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in again and retry.');
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      Alert.alert('Missing info', 'Full name and email are required.');
      return;
    }

    if (changePassword && changePassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      let profilePhotoPath = pickedPhotoPath;

      if (pickedPhotoUri) {
        const uploadRes = await uploadFile({
          uri: pickedPhotoUri,
          user_id: user.id,
          fileName: `profile-${user.id}.jpg`,
          type: 'image/jpeg',
        });

        if (!uploadRes?.success || !uploadRes.data?.file_path) {
          Alert.alert('Upload failed', uploadRes?.message || 'Could not upload profile photo.');
          return;
        }

        profilePhotoPath = uploadRes.data.file_path;
      }

      const updateRes = await updateUserProfile({
        id: user.id,
        full_name: trimmedName,
        email: trimmedEmail,
        phone: user.phone || undefined,
        profile_photo_path: profilePhotoPath || undefined,
        password: changePassword || undefined,
      });

      if (!updateRes?.success) {
        Alert.alert('Update failed', updateRes?.message || 'Could not update profile.');
        return;
      }

      const updatedUser = updateRes.data || {
        ...user,
        full_name: trimmedName,
        email: trimmedEmail,
        phone: user.phone || null,
        profile_photo_path: profilePhotoPath || null,
      };

      await saveSessionUser(updatedUser as SessionUser);
      Alert.alert('Success', 'Profile updated successfully.');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to update profile right now.');
    } finally {
      setIsSaving(false);
    }
  };

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
            {displayedPhoto ? (
              <Image source={displayedPhoto as any} style={styles.avatarImage} />
            ) : (
              <IconSymbol size={48} name="person" color="#ffffff" />
            )}
          </View>
          <Pressable style={styles.changePhotoButton} onPress={handlePickPhoto}>
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
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
              autoCapitalize="none"
              autoCorrect={false}
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
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Animated.View>

        <Animated.View style={styles.submitSection} entering={FadeInUp.delay(600).duration(800)}>
          <Pressable style={[styles.submitButton, isSaving && styles.submitButtonDisabled]} onPress={handleSave} disabled={isSaving}>
            <ThemedText type="subtitle" style={styles.submitButtonText}>
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
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
    overflow: 'hidden',
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
  avatarImage: {
    width: '100%',
    height: '100%',
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
