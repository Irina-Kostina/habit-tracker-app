import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import Home from '../screens/Home'
import Tracker from '../screens/Tracker'
import AddHabit from '../screens/AddHabit'
import Stats from '../screens/Stats'
import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home'

            if (route.name === 'Home') iconName = 'home-outline'
            else if (route.name === 'Tracker') iconName = 'list-outline'
            else if (route.name === 'Add Habit') iconName = 'add-circle-outline'
            else if (route.name === 'Stats') iconName = 'bar-chart-outline'

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#4F8EF7',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Tracker" component={Tracker} />
        <Tab.Screen name="Add Habit" component={AddHabit} />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
