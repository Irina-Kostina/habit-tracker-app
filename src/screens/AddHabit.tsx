import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native'
import { useHabits } from '../context/HabitContext'

export default function AddHabit({ navigation }: any) {
  const { addHabit } = useHabits()

  // State for each input
  const [habitName, setHabitName] = useState('')
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Custom'>('Daily')
  const [notes, setNotes] = useState('')

  // Handle Add
  const handleAdd = () => {
    const trimmed = habitName.trim()
    if (!trimmed) {
      Alert.alert('Please enter a habit name')
      return
    }

    // Create habit object
    const newHabit = {
      name: trimmed,
      frequency,
      notes,
      createdAt: new Date().toISOString(),
    }

    addHabit(newHabit) // Add to global context / storage
    setHabitName('')
    setFrequency('Daily')
    setNotes('')
    Keyboard.dismiss()
    // navigation.navigate('Home')

        // Show success popup with navigation options
    Alert.alert(
      'You created a new habit!',
      `"${trimmed}" has been added to your list.`,
      [
        {
          text: 'Go to Tracker',
          onPress: () => navigation.navigate('Tracker'),
          style: 'default',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
          style: 'cancel',
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new habit</Text>

      {/* Habit name */}
      <Text style={styles.label}>Habit name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter habit name..."
        placeholderTextColor="#9CA3AF"
        value={habitName}
        onChangeText={setHabitName}
      />

      {/* Frequency selector */}
      <Text style={styles.label}>Goal / Frequency</Text>
      <View style={styles.frequencyContainer}>
        {['Daily', 'Weekly', 'Custom'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.frequencyButton,
              frequency === option && styles.selectedFrequency,
            ]}
            onPress={() => setFrequency(option as 'Daily' | 'Weekly' | 'Custom')}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === option && styles.selectedFrequencyText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes / Comment */}
      <Text style={styles.label}>Notes / Comment</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Add any note or motivation..."
        placeholderTextColor="#9CA3AF"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  )
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 24,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#159e9eff',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  frequencyButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedFrequency: {
    backgroundColor: '#1d9686ff',
    borderColor: '#1f9c8aff',
  },
  frequencyText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  selectedFrequencyText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#25ebdbff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
