import React from 'react'
import { Calendar } from 'react-native-calendars'
import { View, StyleSheet } from 'react-native'

export default function HabitCalendar() {
  // Example of days completed
  const markedDates = {
    '2025-10-10': { marked: true, dotColor: '#4da6ff' },
    '2025-10-12': { marked: true, dotColor: '#4da6ff' },
    '2025-10-15': { marked: true, dotColor: '#4da6ff' },
    '2025-10-17': { marked: true, dotColor: '#4da6ff' },
  }

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: '#121212',
          calendarBackground: '#121212',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          arrowColor: '#4da6ff',
          todayTextColor: '#4da6ff',
          textDisabledColor: '#444',
        }}
        markedDates={markedDates}
        markingType={'dot'} // or 'multi-dot'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
})
