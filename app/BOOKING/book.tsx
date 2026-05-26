import { bookings as apiBookings, createBooking } from '@/api';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const calendarPadding = 20;
const calendarDayWidth = (screenWidth - 48 - calendarPadding * 2) / 7;

const services = [
  { id: 'debut', name: 'Debut Photoshoot', color: '#f1d8d0' },
  { id: 'wedding', name: 'Wedding Photoshoot', color: '#dee8f6' },
  { id: 'prenup', name: 'Pre-Nup Photoshoot', color: '#e6f4de' },
  { id: 'maternity', name: 'Maternity Photoshoot', color: '#f4e5c8' },
];

const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

function normalizeTimeLabel(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toUpperCase().replace(/^0(\d:)/, '$1');
}

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isOccupiedStatus(value: unknown): boolean {
  const status = String(value || '').trim().toLowerCase();
  return status !== '' && status !== 'cancelled' && status !== 'canceled' && status !== 'rejected';
}

export default function BookScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const [confirmedSlotsByDate, setConfirmedSlotsByDate] = useState<Record<string, string[]>>({});
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;

  const fullyBookedDays = Object.entries(confirmedSlotsByDate)
    .filter(([dateKey, times]) => dateKey.startsWith(currentMonthPrefix) && new Set(times).size >= TIME_SLOTS.length)
    .map(([dateKey]) => Number(dateKey.slice(-2)));

  const selectedDateKey = selectedDate ? toLocalDateKey(selectedDate) : null;
  const bookedTimesForSelectedDate = selectedDateKey
    ? new Set((confirmedSlotsByDate[selectedDateKey] || []).map(normalizeTimeLabel))
    : new Set<string>();

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={[styles.dayCell, { width: calendarDayWidth }]} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const booked = fullyBookedDays.includes(day);
      const isToday = day === currentDate.getDate();
      const isSelected = selectedDate?.getDate() === day;
      const isPast = day < currentDate.getDate();

      let dayStyle = [styles.dayCell, { width: calendarDayWidth }];
      let textStyle = [styles.dayText];

      if (booked) {
        dayStyle.push(styles.bookedDay);
        textStyle.push(styles.bookedText);
      } else if (isSelected) {
        dayStyle.push(styles.selectedDay);
        textStyle.push(styles.selectedText);
      } else if (isToday) {
        dayStyle.push(styles.todayDay);
        textStyle.push(styles.todayText);
      } else if (isPast) {
        textStyle.push(styles.pastText);
      }

      days.push(
        <Pressable
          key={day}
          style={dayStyle}
          onPress={() => {
            if (!booked && !isPast) {
              setSelectedDate(new Date(year, month, day));
              setSelectedTime('');
            }
          }}
          disabled={booked || isPast}>
          <ThemedText style={textStyle}>{day}</ThemedText>
          {booked && <View style={styles.bookedDot} />}
        </Pressable>
      );
    }

    return days;
  };

  const handleNextStep = () => {
    if (fullName && selectedDate && selectedTime.trim() && selectedService) {
      setStep(2);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const payload = {
        user_id: null,
        client_name: fullName,
        booking_date: selectedDate ? toLocalDateKey(selectedDate) : null,
        booking_time: selectedTime,
        location: null,
        notes: null,
        status: 'pending',
        services: selectedService ? [getServiceName(selectedService)] : [],
      };
      const res = await createBooking(payload);
      if (res && (res as any).success) {
        alert('Booking confirmed! Thank you for booking!');
        router.back();
      } else {
        alert('Failed to create booking: ' + ((res as any).message || 'Unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating booking. Please verify API BASE URL and backend status.');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiBookings();
        if (!mounted) return;
        if (res && res.success && Array.isArray(res.data)) {
          const map: Record<string, string[]> = {};
          (res.data as any[]).forEach((b) => {
            if (!isOccupiedStatus(b.status)) return;
            const dateKey = String(b.booking_date || '').trim();
            const time = String(b.booking_time || '').trim();
            if (!dateKey || !time) return;
            if (!map[dateKey]) {
              map[dateKey] = [];
            }
            map[dateKey].push(normalizeTimeLabel(time));
          });
          setConfirmedSlotsByDate(map);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getServiceName = (id: string | null) => {
    const service = services.find(s => s.id === id);
    return service?.name || '';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (step === 2) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
            <Pressable style={styles.backButton} onPress={() => setStep(1)}>
              <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
            </Pressable>
            <ThemedText type="title" style={styles.title}>Booking Summary</ThemedText>
            <View style={{ width: 40 }} />
          </Animated.View>

          <Animated.View style={styles.summaryCard} entering={FadeInDown.delay(200).duration(800)}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Full Name</ThemedText>
              <ThemedText style={styles.summaryValue}>{fullName}</ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Date</ThemedText>
              <ThemedText style={styles.summaryValue}>{formatDate(selectedDate)}</ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Time</ThemedText>
              <ThemedText style={styles.summaryValue}>{selectedTime}</ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Service</ThemedText>
              <ThemedText style={styles.summaryValue}>{getServiceName(selectedService)}</ThemedText>
            </View>
          </Animated.View>

          <Animated.View style={styles.submitSection} entering={FadeInUp.delay(400).duration(800)}>
            <Pressable style={styles.submitButton} onPress={handleConfirmBooking}>
              <ThemedText type="subtitle" style={styles.submitButtonText}>
                CONFIRM BOOKING
              </ThemedText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
          </Pressable>
          <ThemedText type="title" style={styles.title}>Book a Shoot</ThemedText>
          <View style={{ width: 40 }} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="rgba(102, 102, 102, 0.6)"
            value={fullName}
            onChangeText={setFullName}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <View style={styles.labelRow}>
            <IconSymbol size={20} name="calendar" color="#d4c35a" />
            <ThemedText style={styles.label}>Select Date</ThemedText>
          </View>
          <View style={styles.calendarCard}>
            <ThemedText type="subtitle" style={styles.calendarTitle}>
              {monthNames[month]} {year}
            </ThemedText>
            <View style={styles.daysHeader}>
              {dayNames.map((day) => (
                <View key={day} style={[styles.dayNameCell, { width: calendarDayWidth }]}>
                  <ThemedText style={styles.dayName}>{day}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.daysGrid}>{renderDays()}</View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)}>
          <View style={styles.labelRow}>
            <IconSymbol size={20} name="clock.fill" color="#d4c35a" />
            <ThemedText style={styles.label}>Select Time</ThemedText>
          </View>

          {selectedDate ? (
            <>
              <ThemedText style={styles.timeHelpText}>
                {bookedTimesForSelectedDate.size > 0
                  ? `Booked for this date: ${Array.from(bookedTimesForSelectedDate).join(', ')}`
                  : 'No booked times yet for this date.'}
              </ThemedText>
              <View style={styles.timeSlotsGrid}>
                {TIME_SLOTS.map((slot) => {
                  const normalizedSlot = normalizeTimeLabel(slot);
                  const isSlotBooked = bookedTimesForSelectedDate.has(normalizedSlot);
                  const isSelectedSlot = selectedTime === slot;
                  return (
                    <Pressable
                      key={slot}
                      onPress={() => !isSlotBooked && setSelectedTime(slot)}
                      disabled={isSlotBooked}
                      style={[
                        styles.timeSlotCard,
                        isSlotBooked && styles.timeSlotBooked,
                        isSelectedSlot && styles.timeSlotSelected,
                      ]}>
                      <ThemedText
                        style={[
                          styles.timeSlotText,
                          isSlotBooked && styles.timeSlotBookedText,
                          isSelectedSlot && styles.selectedServiceText,
                        ]}>
                        {slot}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              {bookedTimesForSelectedDate.size >= TIME_SLOTS.length && (
                <ThemedText style={styles.fullyBookedText}>
                  This date is fully booked.
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText style={styles.timeHelpText}>Select a date first to see available time slots.</ThemedText>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800).duration(800)}>
          <ThemedText style={styles.label}>Select Service</ThemedText>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: service.color },
                  selectedService === service.id && styles.selectedServiceCard,
                ]}
                onPress={() => setSelectedService(service.id)}>
                <ThemedText
                  style={[
                    styles.serviceText,
                    selectedService === service.id && styles.selectedServiceText,
                  ]}>
                  {service.name}
                </ThemedText>
                {selectedService === service.id && (
                  <IconSymbol size={20} name="checkmark" color="#ffffff" />
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={styles.submitSection} entering={FadeInUp.delay(1000).duration(800)}>
          <Pressable style={styles.submitButton} onPress={handleNextStep}>
            <ThemedText type="subtitle" style={styles.submitButtonText}>
              CONTINUE TO SUMMARY
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#1a1a2e',
  },
  timeHelpText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 10,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlotCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  timeSlotBooked: {
    backgroundColor: '#efefef',
    borderColor: '#dedede',
    opacity: 0.65,
  },
  timeSlotSelected: {
    backgroundColor: '#1a1a2e',
    borderColor: '#1a1a2e',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '700',
  },
  timeSlotBookedText: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  fullyBookedText: {
    marginTop: 10,
    fontSize: 13,
    color: '#b54f4f',
    fontWeight: '700',
  },
  calendarCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
  },
  dayNameCell: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  todayDay: {
    backgroundColor: 'rgba(212, 195, 90, 0.2)',
    borderWidth: 2,
    borderColor: '#d4c35a',
  },
  todayText: {
    color: '#1a1a2e',
    fontWeight: '800',
  },
  selectedDay: {
    backgroundColor: '#d4c35a',
  },
  selectedText: {
    color: '#1a1a2e',
    fontWeight: '800',
  },
  bookedDay: {
    backgroundColor: 'rgba(26, 26, 46, 0.08)',
    opacity: 0.5,
  },
  bookedText: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  pastText: {
    color: '#cccccc',
  },
  bookedDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a1a2e',
  },
  servicesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
  },
  selectedServiceCard: {
    backgroundColor: '#1a1a2e',
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  selectedServiceText: {
    color: '#ffffff',
  },
  summaryCard: {
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
