import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/* ---------- Type definitions ---------- */
export type Habit = {
  id: string
  name: string
  done: boolean
  frequency?: 'Daily' | 'Weekly' | 'Custom'
  notes?: string
  createdAt?: string
  goal?: string
}

/* ---------- Context type ---------- */
type HabitContextType = {
  habits: Habit[]
  addHabit: (habit: Omit<Habit, 'id' | 'done'>) => void
  toggleHabit: (id: string) => void
  deleteHabit: (id: string) => void
}

/* ---------- Create context ---------- */
const HabitContext = createContext<HabitContextType | undefined>(undefined)

/* ---------- Provider ---------- */
export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loaded, setLoaded] = useState(false) // Wait until initial load before saving

  // --- Load habits from AsyncStorage when app starts ---
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const json = await AsyncStorage.getItem('habits')
        if (json) {
          setHabits(JSON.parse(json))
        } else {
          // Initial demo habits (only for first app launch)
          setHabits([
            {
              id: '1',
              name: 'Morning stretch',
              done: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Drink 2L of water',
              done: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Read 20 minutes',
              done: false,
              createdAt: new Date().toISOString(),
            },
          ])
        }
      } catch (err) {
        console.log('Error loading habits', err)
      } finally {
        setLoaded(true)
      }
    }

    loadHabits()
  }, [])

  // --- Save habits to AsyncStorage whenever they change ---
  useEffect(() => {
    if (!loaded) return // Prevent saving before initial load
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits))
      } catch (err) {
        console.log('Error saving habits', err)
      }
    }
    saveHabits()
  }, [habits, loaded])

  /* ---------- Add new habit ---------- */
  const addHabit = (habit: Omit<Habit, 'id' | 'done'>) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      done: false,
      createdAt: habit.createdAt ?? new Date().toISOString(),
      ...habit,
    }
    setHabits(prev => [...prev, newHabit])
  }

  /* ---------- Toggle done/undone ---------- */
  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, done: !h.done } : h))
    )
  }

  /* ---------- Delete a habit permanently ---------- */
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  /* ---------- Provide context ---------- */
  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit }}>
      {children}
    </HabitContext.Provider>
  )
}

/* ---------- Custom hook ---------- */
export const useHabits = () => {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used inside <HabitProvider>')
  return ctx
}
