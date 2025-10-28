import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 1. Type for a habit
export type Habit = {
  id: string
  name: string
  done: boolean
}

// 2. What we provide to the rest of the app
type HabitContextType = {
  habits: Habit[]
  addHabit: (name: string) => void
  toggleHabit: (id: string) => void
}

// 3. Create the context
const HabitContext = createContext<HabitContextType | undefined>(undefined)

// 4. Provider component (wraps the whole app)
export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([])

  // --- LOAD habits from AsyncStorage on app start ---
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const json = await AsyncStorage.getItem('habits')
        if (json) {
          const parsed: Habit[] = JSON.parse(json)
          setHabits(parsed)
        } else {
          // If nothing saved yet, start with some demo habits
          setHabits([
            { id: '1', name: 'Morning stretch', done: true },
            { id: '2', name: 'Drink 2L of water', done: false },
            { id: '3', name: 'Read 20 minutes', done: false },
          ])
        }
      } catch (err) {
        console.log('Error loading habits', err)
      }
    }

    loadHabits()
  }, [])

  // --- SAVE habits to AsyncStorage whenever they change ---
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits))
      } catch (err) {
        console.log('Error saving habits', err)
      }
    }

    // only save after initial load (avoid saving empty [])
    if (habits.length > 0) {
      saveHabits()
    }
  }, [habits])

  // --- Add new habit ---
  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(), // simple unique id
      name,
      done: false,
    }
    setHabits((prev) => [...prev, newHabit])
  }

  // --- Toggle done / not done ---
  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h
      )
    )
  }

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit }}>
      {children}
    </HabitContext.Provider>
  )
}

// 5. Custom hook for easy access
export const useHabits = () => {
  const ctx = useContext(HabitContext)
  if (!ctx) {
    throw new Error('useHabits must be used inside <HabitProvider>')
  }
  return ctx
}
