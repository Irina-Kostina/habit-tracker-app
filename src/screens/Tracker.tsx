import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  InputAccessoryView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack' // import type helper
import { useHabits } from '../context/HabitContext'
import { TrackerStackParamList } from '../types/navigation' // import your new type

/* ---------- Local Types ---------- */
type Day = {
  day: number
  weekday: string
  done: boolean
  today: boolean
}

type HabitItem = {
  id: string
  name: string
  goal?: string
  notes?: string
  createdAt?: string
}

/* ---------- Helper: current week ---------- */
function getCurrentWeekRange(): Day[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const weekDays: Day[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    weekDays.push({
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      done: false,
      today: d.toDateString() === today.toDateString(),
    })
  }
  return weekDays
}

/* ---------- Component ---------- */
export default function Tracker() {
  // Type-safe navigation
  type TrackerNavigationProp = NativeStackNavigationProp<
    TrackerStackParamList,
    'Tracker'
  >
  const navigation = useNavigation<TrackerNavigationProp>()

  const { habits: sharedHabits, addHabit, deleteHabit } = useHabits()
  const currentWeekDays = useMemo(() => getCurrentWeekRange(), [])

  // ---------- Local list used for rendering (mirrors context) ----------
  const [list, setList] = useState<HabitItem[]>(
    () =>
      (sharedHabits ?? []).map((h: any) => ({
        id: String(h.id ?? h.createdAt ?? Date.now()),
        name: String(h.name ?? 'Untitled'),
        goal: h.goal,
        notes: h.notes,
        createdAt: h.createdAt,
      })) as HabitItem[]
  )

  // Keep local list in sync when context changes (e.g., after app restart)
  useEffect(() => {
    setList(
      (sharedHabits ?? []).map((h: any) => ({
        id: String(h.id ?? h.createdAt ?? Date.now()),
        name: String(h.name ?? 'Untitled'),
        goal: h.goal,
        notes: h.notes,
        createdAt: h.createdAt,
      }))
    )
  }, [sharedHabits])

  // Modal + form state
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [goal, setGoal] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedHabit, setSelectedHabit] = useState<HabitItem | null>(null)

  const inputAccessoryViewID = 'DoneBar'

  /* ---------- Open Add / Edit ---------- */
  const openAddModal = () => {
    setHabitName('')
    setGoal('')
    setNotes('')
    setSelectedHabit(null)
    setIsEditing(false)
    setModalVisible(true)
  }

  const openEditModal = (habit: HabitItem) => {
    setHabitName(habit.name)
    setGoal(habit.goal ?? '')
    setNotes(habit.notes ?? '')
    setSelectedHabit(habit)
    setIsEditing(true)
    setModalVisible(true)
  }

  /* ---------- Save ---------- */
  const handleSave = () => {
    const trimmed = habitName.trim()
    if (!trimmed) {
      Alert.alert('Please enter a habit name')
      return
    }

    if (isEditing && selectedHabit) {
      // Update locally
      setList(prev =>
        prev.map(h =>
          h.id === selectedHabit.id ? { ...h, name: trimmed, goal, notes } : h
        )
      )
      // (Optional) If your context exposes an update function, call it here.

      setModalVisible(false)
      Keyboard.dismiss()
      Alert.alert('Habit updated', `"${trimmed}" has been updated.`)
    } else {
      // Create new locally
      const newHabit: HabitItem = {
        id: Date.now().toString(),
        name: trimmed,
        goal,
        notes,
        createdAt: new Date().toISOString(),
      }
      setList(prev => [...prev, newHabit])

      // Also push to context if available
      addHabit?.({
        name: newHabit.name,
        goal: newHabit.goal,
        notes: newHabit.notes,
        createdAt: newHabit.createdAt,
      })

      setModalVisible(false)
      Keyboard.dismiss()
      Alert.alert('You created a new habit!', `"${trimmed}" has been added.`)
    }

    setHabitName('')
    setGoal('')
    setNotes('')
  }

  /* ---------- Delete ---------- */
  const handleDelete = () => {
    if (!selectedHabit) return
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Remove immediately from local UI
          setList(prev => prev.filter(h => h.id !== selectedHabit.id))
          // Also tell context if it supports deletion
          deleteHabit?.(selectedHabit.id)
          setModalVisible(false)
          Alert.alert('Habit deleted')
        },
      },
    ])
  }

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

    /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.todayDate}>{formattedDate}</Text>
          <Text style={styles.motivation}>How are your habits going this week?</Text>
        </View>

        {/* Habit cards */}
        {list.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })} // ✅ opens analytics screen
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.habitName}>{item.name}</Text>
                {item.goal ? (
                  <Text style={styles.habitGoal}>Goal: {item.goal}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={() => openEditModal(item)}
                style={styles.editButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Week days */}
            <FlatList
              data={currentWeekDays}
              keyExtractor={d => d.day.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              renderItem={({ item: d }) => (
                <View style={styles.dayColumn}>
                  <Text style={styles.dayLabel}>{d.weekday}</Text>
                  <View
                    style={[
                      styles.circle,
                      d.today ? styles.todayCircle : styles.defaultCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        d.today ? { color: '#000' } : { color: '#555' },
                      ]}
                    >
                      {d.day}
                    </Text>
                  </View>
                </View>
              )}
            />
          </TouchableOpacity>
        ))}

        {/* Add button */}
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>＋ Add Habit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---------- Add/Edit Modal ---------- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss()
              setModalVisible(false)
            }}
          >
            <View style={styles.overlayBackground}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContainer}>
                  <ScrollView
                    contentContainerStyle={styles.modalBox}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.modalTitle}>
                      {isEditing ? 'Edit Habit' : 'Create a new habit'}
                    </Text>

                    <Text style={styles.label}>Habit name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter habit name..."
                      placeholderTextColor="#9CA3AF"
                      value={habitName}
                      onChangeText={setHabitName}
                      inputAccessoryViewID="DoneBar"
                    />

                    <Text style={styles.label}>Goal / Frequency</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 20 min a day or 3 times a week"
                      placeholderTextColor="#9CA3AF"
                      value={goal}
                      onChangeText={setGoal}
                      inputAccessoryViewID="DoneBar"
                    />

                    <Text style={styles.label}>Notes / Comment</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Add any note or motivation..."
                      placeholderTextColor="#9CA3AF"
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      inputAccessoryViewID="DoneBar"
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.saveButtonText}>
                        {isEditing ? 'Save Changes' : 'Add Habit'}
                      </Text>
                    </TouchableOpacity>

                    {isEditing && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                      >
                        <Text style={styles.deleteButtonText}>Delete Habit</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.closeModalButton}
                      onPress={() => setModalVisible(false)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.closeModalText}>Cancel</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID="DoneBar">
              <View style={styles.doneBar}>
                <TouchableOpacity onPress={Keyboard.dismiss}>
                  <Text style={styles.doneBarText}>Done</Text>
                </TouchableOpacity>
              </View>
            </InputAccessoryView>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}
      
/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { paddingHorizontal: 16, paddingBottom: 100 },
  header: { marginTop: 10, marginBottom: 25 },
  todayDate: { fontSize: 18, fontWeight: '700', color: '#000' },
  motivation: { fontSize: 16, color: '#6B7280', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  habitName: { fontSize: 18, fontWeight: '700', color: '#000' },
  habitGoal: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  editButton: { paddingVertical: 6, paddingHorizontal: 10 },
  editText: { fontSize: 16, color: '#3B82F6', fontWeight: '500' },

  dayColumn: { alignItems: 'center', marginRight: 10 },
  dayLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultCircle: { backgroundColor: '#E5E7EB' },
  todayCircle: { backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: '#000' },
  dayNumber: { fontSize: 14, fontWeight: '600' },

  addButton: {
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
    alignSelf: 'center',
  },
  modalBox: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 20,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#111',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  deleteButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  closeModalText: { color: '#3B82F6', fontSize: 14 },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  doneBar: {
    backgroundColor: '#1C1C1E',
    padding: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#2C2C2E',
  },
  doneBarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingRight: 12,
  },
})
