import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native'
import { useHabits } from '../context/HabitContext'

export default function AddHabit({ navigation }: any) {
  const { addHabit } = useHabits()
  const [habitName, setHabitName] = useState('')

  const handleAdd = () => {
    const trimmed = habitName.trim()
    if (!trimmed) {
      Alert.alert('Please enter a habit name')
      return
    }

    addHabit(trimmed)       // dd to global context & AsyncStorage
    setHabitName('')        // Clear input
    Keyboard.dismiss()      // Hide keyboard
    navigation.navigate('Home')  // Go back to Home tab
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new habit</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter habit name..."
        placeholderTextColor="#9CA3AF"
        value={habitName}
        onChangeText={setHabitName}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  )
}

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
    color: '#2563EB',
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
