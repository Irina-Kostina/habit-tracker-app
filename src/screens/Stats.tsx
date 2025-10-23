import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Stats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats Screen</Text>
      <Text>Here you’ll see charts and streaks later.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 }
})

export default Stats
