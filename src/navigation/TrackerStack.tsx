import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Tracker from '../screens/Tracker'
import HabitDetails from '../screens/HabitDetails'

const Stack = createNativeStackNavigator()

export default function TrackerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tracker" component={Tracker} />
      <Stack.Screen name="HabitDetails" component={HabitDetails} />
    </Stack.Navigator>
  )
}
