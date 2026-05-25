import { StyleSheet, View, Pressable, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: screenWidth } = Dimensions.get('window');
const padding = 24;
const gap = 16;
const fileWidth = (screenWidth - padding * 2 - gap) / 2;

const files = [
  { name: 'Wedding Shoot', date: 'May 20, 2026', type: 'photo', color: '#f1d8d0' },
  { name: 'Portrait Session', date: 'May 18, 2026', type: 'folder', color: '#dee8f6' },
  { name: 'Event Photos', date: 'May 15, 2026', type: 'photo', color: '#e6f4de' },
  { name: 'Receipts', date: 'May 10, 2026', type: 'document', color: '#f4e5c8' },
];

export default function FileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <ThemedText type="title" style={styles.title}>My Files</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your shoot files, receipts, and reference images in one place.
          </ThemedText>
        </Animated.View>

        <Animated.View style={styles.storageCard} entering={FadeInDown.delay(200).duration(800)}>
          <View style={styles.storageInfo}>
            <View>
              <ThemedText type="subtitle" style={styles.storageTitle}>Storage Used</ThemedText>
              <ThemedText style={styles.storageUsed}>3.1 GB</ThemedText>
            </View>
            <ThemedText style={styles.storageTotal}>of 10 GB</ThemedText>
          </View>
          <View style={styles.storageBar}>
            <View style={styles.storageProgress} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Files</ThemedText>
          <View style={styles.grid}>
            {files.map((file, index) => (
              <Animated.View
                key={file.name}
                style={[styles.fileCard, { backgroundColor: file.color }]}
                entering={FadeInUp.delay(500 + index * 100).duration(600)}>
                <Pressable style={styles.filePressable}>
                  <View style={styles.fileIcon}>
                    <IconSymbol 
                      size={32} 
                      name={file.type === 'folder' ? 'folder' : file.type === 'document' ? 'file' : 'camera.fill'}
                      color="#1a1a2e" 
                    />
                  </View>
                  <ThemedText type="subtitle" style={styles.fileName}>
                    {file.name}
                  </ThemedText>
                  <ThemedText style={styles.fileDate}>
                    {file.date}
                  </ThemedText>
                </Pressable>
              </Animated.View>
            ))}
          </View>
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
  storageCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 28,
    padding: 28,
    gap: 16,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  storageTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  storageUsed: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  storageTotal: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  storageBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageProgress: {
    width: '31%',
    height: '100%',
    backgroundColor: '#d4c35a',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  fileCard: {
    width: fileWidth,
    minHeight: 160,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  filePressable: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  fileDate: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
});
