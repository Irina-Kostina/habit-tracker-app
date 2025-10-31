import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabits } from '../context/HabitContext'

// Helper: generate all days for this month
function getMonthDays() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()

  const arr = []
  for (let i = 1; i <= daysInMonth; i++) {
    arr.push({
      day: i,
      weekday: new Date(year, month, i)
        .toLocaleDateString('en-US', { weekday: 'short' })
        .slice(0, 3),
      done: false,
      today: i === today,
    })
  }
  return arr
}

// Helper: get start (Monday) and end (Sunday) of current week
function getCurrentWeekRange() {
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday = 0 ... Saturday = 6
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    weekDays.push({
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      done: false,
      today:
        d.toDateString() === today.toDateString(), // mark true only for today
    })
  }

  return weekDays
}

export default function Tracker() {
  const { habits: sharedHabits } = useHabits()

  // Get only current week days
  const currentWeekDays = useMemo(() => getCurrentWeekRange(), [])

  // Attach week days to each habit
  const [habits, setHabits] = useState(() =>
    sharedHabits.map(h => ({
      ...h,
      days: JSON.parse(JSON.stringify(currentWeekDays)),
    }))
  )

  // Toggle completion
  const toggleDay = (habitId: string, dayNumber: number) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const updatedDays = habit.days.map((d: { day: number; done: boolean }) =>
            d.day === dayNumber ? { ...d, done: !d.done } : d
          )
          return { ...habit, days: updatedDays }
        }
        return habit
      })
    )
  }

  // Header date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.todayDate}>{formattedDate}</Text>
          <Text style={styles.motivation}>How are your habits going this week?</Text>
        </View>

        {/* Habit Cards */}
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitFreq}>This week</Text>
              </View>

              {/* Only 7 days — current week */}
              <FlatList
                data={item.days}
                keyExtractor={d => d.day.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
                getItemLayout={(_, idx) => ({
                  length: 50,
                  offset: 50 * idx,
                  index: idx,
                })}
                renderItem={({ item: d }) => (
                  <View style={styles.dayColumn}>
                    {/* Weekday label above */}
                    <Text style={styles.dayLabel}>{d.weekday}</Text>

                    <TouchableOpacity
                      onPress={() => toggleDay(item.id, d.day)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.circle,
                          d.done
                            ? styles.doneCircle
                            : d.today
                            ? styles.todayCircle
                            : styles.defaultCircle,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayNumber,
                            d.done
                              ? { color: '#fff' }
                              : d.today
                              ? { color: '#000' }
                              : { color: '#555' },
                          ]}
                        >
                          {d.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 25,
  },
  todayDate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  motivation: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  habitFreq: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  dayColumn: {
    alignItems: 'center',
    marginRight: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultCircle: {
    backgroundColor: '#E5E7EB',
  },
  doneCircle: {
    backgroundColor: '#000',
  },
  todayCircle: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#000',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
})
