import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabits } from '../context/HabitContext' // ✅ added import

// Helper: generate all days of this month
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
      weekday: new Date(year, month, i).toLocaleDateString('en-US', {
        weekday: 'short',
      })[0],
      done: false,
      today: i === today,
    })
  }
  return { arr, todayIndex: today - 1 }
}

export default function Tracker() {
  // ✅ Use shared habits from context
  const { habits: sharedHabits } = useHabits()

  const { arr: baseMonthDays, todayIndex } = useMemo(() => getMonthDays(), [])

  // ✅ Create a local copy that attaches the month days to each shared habit
  const [habits, setHabits] = useState(() =>
    sharedHabits.map(h => ({ ...h, days: JSON.parse(JSON.stringify(baseMonthDays)) }))
  )

  const flatListRefs = useRef<(FlatList<any> | null)[]>([])

  useEffect(() => {
    flatListRefs.current.forEach(ref => {
      ref?.scrollToIndex({
        index: todayIndex > 1 ? todayIndex - 1 : 0,
        animated: false,
      })
    })
  }, [todayIndex])

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

        {/* Habits */}
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <View style={styles.habitBlock}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.monthLabel}>
                {new Date().toLocaleString('default', { month: 'short' })}
              </Text>

              <FlatList
                ref={el => {
                  flatListRefs.current[index] = el
                }}
                data={item.days}
                keyExtractor={d => d.day.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                getItemLayout={(_, idx) => ({
                  length: 50,
                  offset: 50 * idx,
                  index: idx,
                })}
                renderItem={({ item: d }) => (
                  <View style={styles.dayColumn}>
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
                    <Text style={styles.dayLabel}>{d.weekday}</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
  },
  header: {
    marginTop: 10,
    marginBottom: 25,
    paddingHorizontal: 20,
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
  habitBlock: {
    marginBottom: 40,
    paddingHorizontal: 0,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'lowercase',
    color: '#000',
    paddingHorizontal: 20,
  },
  monthLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    textTransform: 'lowercase',
    paddingHorizontal: 20,
  },
  dayColumn: {
    alignItems: 'center',
    marginRight: 3,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
  dayLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
})
