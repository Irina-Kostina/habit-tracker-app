import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Tracker from '../screens/Tracker'
import Stats from '../screens/Stats'
import ArticleDetails from '../screens/ArticleDetails'
import { Ionicons } from '@expo/vector-icons'

// Create tab and stack navigators
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Tabs (your main 3 screens)
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

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
      <Tab.Screen name="Tracker" component={Tracker} />
      <Tab.Screen name="Stats" component={Stats} />
    </Tab.Navigator>
  )
}

// Combine tabs + article detail screen
export default function MainTabs() {
  return (
    <Stack.Navigator>
      {/* All tab screens */}
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

      {/* Article details screen */}
      <Stack.Screen
        name="ArticleDetails"
        component={ArticleDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
