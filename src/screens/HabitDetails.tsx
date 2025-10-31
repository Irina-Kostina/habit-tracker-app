// HabitDetails.tsx
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import HabitStatsChart from '../components/HabitStatsChart'
import HabitCalendar from '../components/HabitCalendar'

type HabitDetailsRouteParams = {
  habitId?: string
}

export default function HabitDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  // ✅ Safe line: won't crash if params are missing
  const { habitId } = (route.params || {}) as HabitDetailsRouteParams

  // Example fake data (replace later with real from context)
  const habit = {
    name: 'English',
    frequency: '4 times a week',
    reminder: false,
    timesDone: 125,
    timesMissed: 42,
    monthPercent: 45,
    totalPercent: 63,
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{habit.name}</Text>
      </View>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{habit.frequency}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {habit.reminder ? 'Reminder On' : 'Reminder Off'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsBox}>
        <Text style={styles.statsValue}>6.5</Text>
        <Text style={styles.statsLabel}>avg</Text>
        <View style={styles.statsNumbers}>
          <Text style={styles.smallText}>{habit.timesDone} times</Text>
          <Text style={styles.smallText}>{habit.timesMissed} missed</Text>
          <Text style={styles.smallText}>{habit.monthPercent}% month</Text>
          <Text style={styles.smallText}>{habit.totalPercent}% total</Text>
        </View>
      </View>

      {/* Chart */}
      <Text style={styles.sectionTitle}>Statistic</Text>
      <HabitStatsChart />

      {/* Calendar */}
      <Text style={styles.sectionTitle}>History</Text>
      <HabitCalendar />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  infoText: { color: '#ccc', textAlign: 'center' },
  statsBox: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  statsValue: { color: '#4da6ff', fontSize: 36, fontWeight: 'bold' },
  statsLabel: { color: '#999' },
  statsNumbers: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallText: { color: '#ccc', fontSize: 12 },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10,
  },
})
