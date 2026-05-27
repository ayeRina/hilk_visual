import { uploads as apiUploads, resolveAssetUrl, resetWorkingBase } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getSessionUser } from '@/src/session';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const padding = 24;
const gap = 16;
const fileWidth = (screenWidth - padding * 2 - gap) / 2;

const sampleColors = ['#f1d8d0', '#dee8f6', '#e6f4de', '#f4e5c8'];

function getFallbackAssetUrl(assetPath?: string | null): string | null {
  if (!assetPath) {
    return null;
  }

  const normalizedPath = String(assetPath).replace(/\\/g, '/').trim().replace(/^\/+/, '');
  return `http://localhost/admin_hilkvisual/${normalizedPath}`;
}

interface FileItem {
  name: string;
  date: string;
  dateObj: Date;
  type: string;
  isImage: boolean;
  color: string;
  path: string;
  url: string | null;
  id: number;
}

interface GroupedFiles {
  [key: string]: FileItem[];
}

export default function FileScreen() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [viewerModal, setViewerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        resetWorkingBase();
        const sessionUser = await getSessionUser();
        const res = await apiUploads(sessionUser?.id);
        if (!mounted) return;
        if (res && res.success && Array.isArray(res.data)) {
          setFiles(res.data.map((f: any, idx: number) => {
            const isImage = Boolean(f.file_type && String(f.file_type).startsWith('image'));
            const path = f.file_path;
            const dateObj = new Date(f.created_at);
            return {
              name: f.file_name || `File ${f.id}`,
              date: dateObj.toLocaleDateString(),
              dateObj,
              type: isImage ? 'photo' : 'document',
              isImage,
              color: sampleColors[idx % sampleColors.length],
              path,
              url: resolveAssetUrl(path) ?? getFallbackAssetUrl(path),
              id: f.id,
            };
          }));
        } else {
          setFiles([]);
        }
      } catch {
        setFiles([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const groupedFiles = useMemo(() => {
    const groups: GroupedFiles = {};
    files.forEach((file) => {
      const monthYear = file.dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(file);
    });
    return groups;
  }, [files]);

  const sortedFolders = useMemo(() => {
    return Object.keys(groupedFiles).sort((a, b) => {
      const dateA = new Date(groupedFiles[a][0].dateObj);
      const dateB = new Date(groupedFiles[b][0].dateObj);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedFiles]);

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const openImageViewer = (file: FileItem) => {
    if (file.isImage) {
      setSelectedImage(file);
      setViewerModal(true);
    }
  };

  const handleDownload = async (file: FileItem) => {
    if (!file.url) return;
    try {
      await Linking.openURL(file.url);
    } catch {
      // ignore
    }
  };

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
          {!loading && files.length === 0 ? (
            <View style={styles.emptyCard}>
              <IconSymbol size={28} name="tray" color="#999999" />
              <ThemedText style={styles.emptyText}>No files yet. Your images will appear here.</ThemedText>
            </View>
          ) : null}

          {sortedFolders.map((folder, folderIdx) => {
            const isExpanded = expandedFolders.has(folder);
            const folderFiles = groupedFiles[folder];
            return (
              <Animated.View
                key={folder}
                entering={FadeInUp.delay(400 + folderIdx * 100).duration(600)}>
                <Pressable
                  style={styles.folderHeader}
                  onPress={() => toggleFolder(folder)}>
                  <View style={styles.folderHeaderContent}>
                    <IconSymbol
                      size={24}
                      name="folder"
                      color="#d4c35a"
                    />
                    <View style={styles.folderInfo}>
                      <ThemedText style={styles.folderName}>{folder}</ThemedText>
                      <ThemedText style={styles.folderCount}>
                        {folderFiles.length} {folderFiles.length === 1 ? 'file' : 'files'}
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol
                    size={20}
                    name={isExpanded ? 'chevron.up' : 'chevron.down'}
                    color="#999999"
                  />
                </Pressable>

                {isExpanded && (
                  <View style={styles.grid}>
                    {folderFiles.map((file, idx) => (
                      <Animated.View
                        key={file.id}
                        style={[styles.fileCard, { backgroundColor: file.color }]}
                        entering={FadeInUp.delay(50 + idx * 50).duration(400)}>
                        <Pressable
                          style={styles.filePressable}
                          onPress={() => openImageViewer(file)}>
                          <View style={styles.fileIcon}>
                            {file.isImage && file.url ? (
                              <Image source={{ uri: file.url }} style={styles.filePreviewImage} />
                            ) : (
                              <IconSymbol
                                size={32}
                                name="doc.text"
                                color="#1a1a2e"
                              />
                            )}
                          </View>
                          <ThemedText type="subtitle" style={styles.fileName} numberOfLines={2}>
                            {file.name}
                          </ThemedText>
                          {file.isImage && (
                            <Pressable
                              style={styles.downloadButton}
                              onPress={() => handleDownload(file)}>
                              <IconSymbol size={16} name="arrow.down.to.line" color="#1a1a2e" />
                              <ThemedText style={styles.downloadText}>Download</ThemedText>
                            </Pressable>
                          )}
                        </Pressable>
                      </Animated.View>
                    ))}
                  </View>
                )}
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>

      <Modal visible={viewerModal} transparent animationType="fade" onRequestClose={() => setViewerModal(false)}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setViewerModal(false)} />
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={() => setViewerModal(false)}>
              <IconSymbol size={28} name="xmark.circle.fill" color="#ffffff" />
            </Pressable>

            <View style={styles.modalImageContainer}>
              {(selectedImage?.url || getFallbackAssetUrl(selectedImage?.path)) ? (
                <Image
                  source={{ uri: selectedImage?.url || getFallbackAssetUrl(selectedImage?.path) || undefined }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : (
                <ThemedText style={styles.modalEmptyText}>
                  Image not available.
                </ThemedText>
              )}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalActionButton}
                onPress={() => handleDownload(selectedImage!)}>
                <IconSymbol size={24} name="arrow.down.to.line" color="#ffffff" />
                <ThemedText style={styles.modalActionText}>Download</ThemedText>
              </Pressable>
              <Pressable
                style={styles.modalActionButton}
                onPress={() => setViewerModal(false)}>
                <IconSymbol size={24} name="checkmark.circle.fill" color="#ffffff" />
                <ThemedText style={styles.modalActionText}>Done</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyCard: {
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
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
    overflow: 'hidden',
  },
  filePreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  folderInfo: {
    flexDirection: 'column',
    gap: 2,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  fileDate: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    marginTop: 12,
  },
  folderHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  folderCount: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 72,
    paddingBottom: 24,
    gap: 16,
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 260,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalEmptyText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#d4c35a',
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
