import { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: screenWidth } = Dimensions.get('window');
const dayWidth = (screenWidth - 48 - 12) / 7;

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const bookedDates = [5, 8, 12, 15, 19, 22, 26];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isBooked = (day: number) => bookedDates.includes(day);
  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };
  const isSelected = (day: number) => 
    selectedDate?.getDate() === day && 
    selectedDate?.getMonth() === month && 
    selectedDate?.getFullYear() === year;
  const isPast = (day: number) => {
    const today = new Date();
    const dateToCheck = new Date(year, month, day);
    return dateToCheck < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleDatePress = (day: number) => {
    if (!isBooked(day) && !isPast(day)) {
      setSelectedDate(new Date(year, month, day));
    }
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const booked = isBooked(day);
      const today = isToday(day);
      const selected = isSelected(day);
      const past = isPast(day);

      let dayStyle = [styles.dayCell];
      let textStyle = [styles.dayText];

      if (booked) {
        dayStyle.push(styles.bookedDay);
        textStyle.push(styles.bookedText);
      } else if (selected) {
        dayStyle.push(styles.selectedDay);
        textStyle.push(styles.selectedText);
      } else if (today) {
        dayStyle.push(styles.todayDay);
        textStyle.push(styles.todayText);
      } else if (past) {
        textStyle.push(styles.pastText);
      }

      days.push(
        <Pressable
          key={day}
          style={dayStyle}
          onPress={() => handleDatePress(day)}
          disabled={booked || past}>
          <ThemedText style={textStyle}>{day}</ThemedText>
          {booked && <View style={styles.bookedDot} />}
        </Pressable>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(800)}>
          <ThemedText type="title" style={styles.title}>Calendar</ThemedText>
          <ThemedText style={styles.subtitle}>
            Choose a shoot date and time for your next session.
          </ThemedText>
        </Animated.View>

        <Animated.View style={styles.calendarCard} entering={FadeInDown.delay(200).duration(800)}>
          <View style={styles.monthHeader}>
            <Pressable style={styles.monthButton} onPress={() => changeMonth(-1)}>
              <IconSymbol size={24} name="chevron.left" color="#1a1a2e" />
            </Pressable>
            <ThemedText type="subtitle" style={styles.monthTitle}>
              {monthNames[month]} {year}
            </ThemedText>
            <Pressable style={styles.monthButton} onPress={() => changeMonth(1)}>
              <IconSymbol size={24} name="chevron.right" color="#1a1a2e" />
            </Pressable>
          </View>

          <View style={styles.daysHeader}>
            {dayNames.map((day) => (
              <View key={day} style={styles.dayNameCell}>
                <ThemedText style={styles.dayName}>{day}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>{renderDays()}</View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.legendDot} />
              <ThemedText style={styles.legendText}>Available</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.todayLegendDot]} />
              <ThemedText style={styles.legendText}>Today</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.selectedLegendDot]} />
              <ThemedText style={styles.legendText}>Selected</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.bookedLegendDot]} />
              <ThemedText style={styles.legendText}>Booked</ThemedText>
            </View>
          </View>
        </Animated.View>

        {selectedDate && (
          <Animated.View style={styles.selectedCard} entering={FadeInUp.delay(400).duration(800)}>
            <ThemedText type="subtitle" style={styles.selectedTitle}>
              Selected Date
            </ThemedText>
            <ThemedText style={styles.selectedDate}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </ThemedText>
            <Pressable style={styles.confirmButton}>
              <ThemedText type="subtitle" style={styles.confirmButtonText}>
                CONFIRM DATE
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  calendarCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  monthButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 195, 90, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayNameCell: {
    width: dayWidth,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: dayWidth,
    height: dayWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 16,
  },
  dayText: {
    fontSize: 16,
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
    shadowColor: '#d4c35a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
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
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1a1a2e',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 26, 46, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d4c35a',
  },
  todayLegendDot: {
    backgroundColor: 'rgba(212, 195, 90, 0.2)',
    borderColor: '#d4c35a',
  },
  selectedLegendDot: {
    backgroundColor: '#d4c35a',
    borderColor: '#d4c35a',
  },
  bookedLegendDot: {
    backgroundColor: 'rgba(26, 26, 46, 0.2)',
    borderColor: 'transparent',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  selectedCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 28,
    padding: 28,
    gap: 16,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedDate: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 32,
  },
  confirmButton: {
    marginTop: 8,
    backgroundColor: '#d4c35a',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#1a1a2e',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
