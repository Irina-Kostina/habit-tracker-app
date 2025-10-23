import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const AddHabit = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Habit Screen</Text>
      <Text>Here you’ll add new habits later.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 }
})

export default AddHabit
