import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Tracker from '../screens/Tracker'
import Stats from '../screens/Stats'
import ArticleDetails from '../screens/ArticleDetails'
import HabitDetails from '../screens/HabitDetails'
import { Ionicons } from '@expo/vector-icons'

// --- Create navigators ---
const Tab = createBottomTabNavigator()
const RootStack = createNativeStackNavigator() // renamed for clarity
const TrackerStackNav = createNativeStackNavigator()

// --- Tracker stack (for navigating inside Tracker tab) ---
function TrackerStack() {
  return (
    <TrackerStackNav.Navigator screenOptions={{ headerShown: false }}>
      <TrackerStackNav.Screen name="TrackerMain" component={Tracker} />
      <TrackerStackNav.Screen name="HabitDetails" component={HabitDetails} />
    </TrackerStackNav.Navigator>
  )
}

// --- Bottom Tabs ---
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline'

          if (route.name === 'Home') iconName = 'home-outline'
          else if (route.name === 'Tracker') iconName = 'list-outline'
          else if (route.name === 'Stats') iconName = 'bar-chart-outline'

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#4F8EF7',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {/* Tracker tab now uses its own stack */}
      <Tab.Screen name="Tracker" component={TrackerStack} />
      <Tab.Screen name="Stats" component={Stats} />
    </Tab.Navigator>
  )
}

// --- Root Stack (tabs + article details) ---
export default function MainTabs() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={Tabs} />
      <RootStack.Screen name="ArticleDetails" component={ArticleDetails} />
    </RootStack.Navigator>
  )
}
