import { photoshoots as apiPhotoshoots, resolveAssetUrl } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface Photoshoot {
  id: number;
  client_name: string;
  photoshoot_date: string;
  location: string;
  description: string | null;
  image_path: string | null;
  created_at: string;
}

export default function PhotoshootsScreen() {
  const router = useRouter();
  const [photoshoots, setPhotoshoots] = useState<Photoshoot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiPhotoshoots();
        if (!mounted) return;
        if (res?.success && Array.isArray(res.data)) {
          setPhotoshoots(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch photoshoots:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4c35a" />
          <ThemedText style={styles.loadingText}>Loading photoshoots...</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>Photoshoots</ThemedText>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <ThemedText style={styles.subtitle}>Explore our past photoshoots & portfolio</ThemedText>
        </Animated.View>

        {photoshoots.length === 0 ? (
          <Animated.View style={styles.emptyState} entering={FadeInUp.delay(400).duration(800)}>
            <IconSymbol size={64} name="photo" color="#d4c35a" />
            <ThemedText style={styles.emptyStateText}>No photoshoots yet</ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Check back soon for our latest work
            </ThemedText>
          </Animated.View>
        ) : (
          <View style={styles.grid}>
            {photoshoots.map((shoot, index) => (
              <Animated.View
                key={shoot.id}
                style={styles.card}
                entering={FadeInUp.delay(200 + index * 100).duration(600)}>
                {shoot.image_path ? (
                  <Image
                    source={{ uri: resolveAssetUrl(shoot.image_path) || '' }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={styles.cardImagePlaceholder}>
                    <IconSymbol size={48} name="photo" color="#d4c35a" />
                  </View>
                )}

                <View style={styles.cardContent}>
                  <ThemedText style={styles.cardTitle} numberOfLines={1}>
                    {shoot.client_name}
                  </ThemedText>

                  <View style={styles.cardMeta}>
                    <IconSymbol size={14} name="calendar" color="#d4c35a" />
                    <ThemedText style={styles.cardMetaText}>
                      {new Date(shoot.photoshoot_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </ThemedText>
                  </View>

                  <View style={styles.cardMeta}>
                    <IconSymbol size={14} name="location" color="#d4c35a" />
                    <ThemedText style={styles.cardMetaText} numberOfLines={1}>
                      {shoot.location}
                    </ThemedText>
                  </View>

                  {shoot.description && (
                    <ThemedText style={styles.cardDescription} numberOfLines={2}>
                      {shoot.description}
                    </ThemedText>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999999',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: (screenWidth - 48 - 16) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  cardDescription: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
    marginTop: 8,
  },
});
