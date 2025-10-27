import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Progress from 'react-native-progress'

export default function Home({ navigation }: any) {
  // Format today's date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Mock habit data
  const [habits, setHabits] = useState([
    { id: '1', name: 'Morning stretch', done: true },
    { id: '2', name: 'Drink 2L of water', done: false },
    { id: '3', name: 'Read 20 minutes', done: false },
    { id: '4', name: 'Meditate 10 mins', done: true },
    { id: '5', name: 'Go for a walk', done: false },
    { id: '6', name: 'Eat healthy lunch', done: false },
  ])

  // Calculate progress
  const total = habits.length
  const completed = habits.filter(h => h.done).length
  const progress = total > 0 ? completed / total : 0

  // Random motivational message
  const messages = [
    "Let's make today count",
    "Small steps every day lead to big change",
    "Consistency beats intensity",
    "You’re doing amazing — keep it up!",
    "Discipline is choosing what you want most over what you want now",
    "A little progress each day adds up to big results",
  ]
  const [message, setMessage] = useState('')
  useEffect(() => {
    const random = Math.floor(Math.random() * messages.length)
    setMessage(messages[random])
  }, [])

  // Render each habit row
  const renderHabit = ({ item }: any) => (
    <View style={styles.habitItem}>
      <Ionicons
        name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={item.done ? '#4F8EF7' : '#aaa'}
      />
      <Text style={styles.habitText}>{item.name}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.greeting}>Welcome back, Irina 👋</Text>
      <Text style={styles.message}>{message}</Text>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Progress.Circle
          size={110}
          progress={progress}
          showsText={true}
          color="#44cfbdff"
          unfilledColor="#E0E0E0"
          borderWidth={0}
          thickness={8}
          formatText={() => `${Math.round(progress * 100)}%`}
        />
        <Text style={styles.summaryText}>
          {completed} / {total} habits completed
        </Text>
      </View>

      {/* Habit list */}
      <Text style={styles.sectionTitle}>Today's Habits</Text>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tracker')}
      >
        <Text style={styles.buttonText}>Go to Tracker</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 80,
  },
  date: {
    fontSize: 20,
    color: '#666',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4F8EF7',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginTop: 6,
    marginBottom: 24,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
