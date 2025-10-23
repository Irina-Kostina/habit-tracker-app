import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

// Helper: generate days for this month
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
      done: false, // default false
      today: i === today,
    })
  }
  return { arr, todayIndex: today - 1 }
}

// Mock habits for now
const mockHabits = [
  { id: '1', name: 'sleep 8hrs' },
  { id: '2', name: 'meditate' },
  { id: '3', name: 'exercise' },
]

const Home = () => {
  const { arr: baseMonthDays, todayIndex } = useMemo(() => getMonthDays(), [])
  const [habits, setHabits] = useState(() =>
    mockHabits.map(h => ({ ...h, days: JSON.parse(JSON.stringify(baseMonthDays)) }))
  )

  const flatListRefs = useRef<FlatList[]>([])

  // Scroll each habit's FlatList to today's index on mount
  useEffect(() => {
    flatListRefs.current.forEach(ref => {
      ref?.scrollToIndex({
        index: todayIndex > 1 ? todayIndex - 1 : 0,
        animated: false,
      })
    })
  }, [todayIndex])

  // Toggle selected day (done/not done)
  const toggleDay = (habitId: string, dayNumber: number) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const updatedDays = habit.days.map((d: { day: number; done: any }) =>
            d.day === dayNumber ? { ...d, done: !d.done } : d
          )
          return { ...habit, days: updatedDays }
        }
        return habit
      })
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.habitBlock}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.monthLabel}>
              {new Date().toLocaleString('default', { month: 'short' })}
            </Text>

            <FlatList
              ref={el => (flatListRefs.current[index] = el!)}
              data={item.days}
              keyExtractor={d => d.day.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={(data, idx) => ({
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  habitBlock: {
    marginBottom: 40,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'lowercase',
    color: '#000',
  },
  monthLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    textTransform: 'lowercase',
  },
  dayColumn: {
    alignItems: 'center',
    marginRight: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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

export default Home
