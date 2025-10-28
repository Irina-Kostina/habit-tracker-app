import React from 'react'
import { HabitProvider } from './src/context/HabitContext'
// ⬆ adjust the path if your file is elsewhere

import { NavigationContainer } from '@react-navigation/native'
import MyTabs from './src/navigation/MainTabs' 
// ^ pretend you already have bottom tabs component
// if not, just wrap whatever root you currently render

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </HabitProvider>
  )
}
