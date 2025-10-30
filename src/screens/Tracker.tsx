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

// ✅ Helper: generate full month days with weekday info
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

  return { arr, todayIndex: today - 1 }
}

export default function Tracker() {
  const { habits: sharedHabits } = useHabits()
  const { arr: baseMonthDays, todayIndex } = useMemo(() => getMonthDays(), [])

  // ✅ Create local habit data with month days
  const [habits, setHabits] = useState(() =>
    sharedHabits.map(h => ({ ...h, days: JSON.parse(JSON.stringify(baseMonthDays)) }))
  )

  const flatListRefs = useRef<(FlatList<any> | null)[]>([])

  useEffect(() => {
    // scroll horizontally so today is visible in center
    flatListRefs.current.forEach(ref => {
      ref?.scrollToIndex({
        index: Math.max(todayIndex - 3, 0),
        animated: false,
      })
    })
  }, [todayIndex])

  // ✅ Toggle completion
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
          <Text style={styles.motivation}>How are your habits going today?</Text>
        </View>

        {/* Habit Cards */}
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitFreq}>Everyday</Text>
              </View>

              <FlatList
                ref={el => {
                  flatListRefs.current[index] = el
                }}
                data={item.days}
                keyExtractor={d => d.day.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                }}
                getItemLayout={(_, idx) => ({
                  length: 50,
                  offset: 50 * idx,
                  index: idx,
                })}
                // ✅ limit visible days to 7 at a time
                initialScrollIndex={Math.max(todayIndex - 3, 0)}
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

// 💅 Styles
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

  // Card layout
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
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
    marginBottom: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textTransform: 'capitalize',
  },
  habitFreq: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Days
  dayColumn: {
    alignItems: 'center',
    marginRight: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
