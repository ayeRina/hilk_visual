import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const faqs = [
  {
    question: 'How do I book a photoshoot?',
    answer: 'You can book a photoshoot by clicking on the "Book Photoshoots" card on the home screen, or by using the "Book Now" button. Fill out the form and confirm your booking.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including credit cards, debit cards, and bank transfers. Payment details will be provided upon confirmation of your booking.',
  },
  {
    question: 'Can I reschedule my booking?',
    answer: 'Yes, you can reschedule your booking up to 48 hours before your scheduled time. Please contact our support team for assistance.',
  },
  {
    question: 'How do I access my photos?',
    answer: 'Your photos will be available in the "My Files" section once they are ready for download. You will receive an email notification when they are available.',
  },
  {
    question: 'What should I wear for my photoshoot?',
    answer: 'We recommend wearing comfortable clothing that makes you feel confident. Solid colors work well, and avoid busy patterns. Feel free to bring multiple outfits!',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>Help & Support</ThemedText>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View style={styles.contactCard} entering={FadeInDown.delay(200).duration(800)}>
          <ThemedText type="subtitle" style={styles.contactTitle}>Need Help?</ThemedText>
          <ThemedText style={styles.contactText}>
            Our support team is here to assist you with any questions or concerns you may have.
          </ThemedText>
          <View style={styles.contactButtons}>
            <Pressable style={styles.contactButton}>
              <IconSymbol size={20} name="person" color="#1a1a2e" />
              <ThemedText style={styles.contactButtonText}>Contact Us</ThemedText>
            </Pressable>
            <Pressable style={styles.contactButton}>
              <IconSymbol size={20} name="questionmark" color="#1a1a2e" />
              <ThemedText style={styles.contactButtonText}>FAQ</ThemedText>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View style={styles.faqSection} entering={FadeInUp.delay(400).duration(800)}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
          {faqs.map((faq, index) => (
            <Animated.View
              key={index}
              style={styles.faqItem}
              entering={FadeInUp.delay(500 + index * 100).duration(600)}>
              <Pressable
                style={styles.faqQuestion}
                onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                <ThemedText style={styles.faqQuestionText}>{faq.question}</ThemedText>
                <View style={expandedIndex === index && { transform: [{ rotate: '-90deg' }] }}>
                  <IconSymbol
                    size={20}
                    name={expandedIndex === index ? 'chevron.left' : 'chevron.right'}
                    color="#d4c35a"
                  />
                </View>
              </Pressable>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.faqAnswerText}>{faq.answer}</ThemedText>
                </View>
              )}
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
  contactCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 28,
    padding: 24,
    gap: 16,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contactTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  contactText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    lineHeight: 22,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#d4c35a',
    borderRadius: 18,
  },
  contactButtonText: {
    color: '#1a1a2e',
    fontSize: 15,
    fontWeight: '800',
  },
  faqSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  faqItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
  },
});
