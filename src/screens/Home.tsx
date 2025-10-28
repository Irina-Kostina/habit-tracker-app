import React, { useState, useEffect } from 'react'
// Importing UI elements from React Native
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native'
// Icon library for checkmarks and circles
import { Ionicons } from '@expo/vector-icons'
// Circular progress component
import * as Progress from 'react-native-progress'
import { useHabits } from '../context/HabitContext'

// Home screen component
export default function Home({ navigation }: any) {
  // Get today's date and format it in a readable style
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-NZ', {
    weekday: 'long', // e.g. “Tuesday”
    day: 'numeric',  // e.g. “28”
    month: 'long',   // e.g. “October”
    year: 'numeric', // e.g. “2025”
  })

  // Use shared habits from context instead of local mock data
  const { habits } = useHabits()

  // Calculate daily progress:
  const total = habits.length
  const completed = habits.filter((h) => h.done).length
  const progress = total > 0 ? completed / total : 0

  // Motivational messages
  const messages = [
    'Small things become great when done with love.',
    'Discipline is choosing what you want most over what you want now.',
    'A little progress each day adds up to big results.',
    'Start where you are. Use what you have. Do what you can.',
    'Consistency creates confidence.',
  ]

  const [message, setMessage] = useState('')

  useEffect(() => {
    const random = Math.floor(Math.random() * messages.length)
    setMessage(messages[random])
  }, [])

  // Renders each habit
  const renderHabit = ({ item }: any) => (
    <View style={styles.habitItem}>
      <Ionicons
        name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={item.done ? '#10B981' : '#9CA3AF'}
      />
      <Text style={styles.habitText}>{item.name}</Text>
    </View>
  )

  // --- NEW: Article Data ---
  const articles = [
    {
      id: '1',
      title: 'The Psychology of Habits',
      subtitle: 'Understand how habits shape your life and how to reprogram them.',
      image: 'https://images.unsplash.com/photo-1581091215367-59ab6b6d4392',
    },
    {
      id: '2',
      title: 'Motivation That Lasts',
      subtitle: 'Discover how to stay consistent even when you don’t feel inspired.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    },
    {
      id: '3',
      title: 'Mindfulness for Busy Minds',
      subtitle: 'Learn to pause and build better awareness during your day.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    },
  ]

  const renderArticle = ({ item }: any) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() =>
        navigation.navigate('ArticleDetails', {
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          content:
            item.content ||
            'This is a full article about psychology and motivation. Here you can add detailed text later, like advice on building good habits, understanding behaviour patterns, and staying consistent. The text can be long and scrollable.',
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleTextBlock}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  )

  // Main screen layout
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.greeting}>Welcome back, Irina</Text>
      <Text style={styles.message}>{message}</Text>

      {/* --- Dashboard-style quick action cards --- */}
      <View style={styles.grid}>
        {/* Card 1 — Track Habits */}
        <TouchableOpacity
          style={[styles.card, styles.cardBlue]}
          onPress={() => navigation.navigate('Tracker')}
        >
          <Ionicons name="checkmark-circle-outline" size={30} color="#fff" />
          <Text style={styles.cardTitle}>Track habits</Text>
          <Text style={styles.cardSubtitle}>View today’s progress</Text>
        </TouchableOpacity>

        {/* Card 2 — Add New Habit */}
        <TouchableOpacity
          style={[styles.card, styles.cardAmber]}
          onPress={() => navigation.navigate('Add Habit')}
        >
          <Ionicons name="add-circle-outline" size={30} color="#1F2937" />
          <Text style={styles.cardTitleDark}>Add new habit</Text>
          <Text style={styles.cardSubtitleDark}>Create a new goal</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3 — View Statistics */}
        <TouchableOpacity
          style={[styles.card, styles.cardDark]}
          onPress={() => navigation.navigate('Stats')}
        >
          <Ionicons name="bar-chart-outline" size={30} color="#FAFAFA" />
          <Text style={styles.cardTitleLight}>View stats</Text>
          <Text style={styles.cardSubtitleLight}>Check your streak</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Progress.Circle
          size={110}
          progress={progress}
          showsText={true}
          color="#2563EB"
          unfilledColor="#E5E7EB"
          borderWidth={0}
          thickness={8}
          formatText={() => `${Math.round(progress * 100)}%`}
        />
        <Text style={styles.summaryText}>
          {completed} / {total} habits completed
        </Text>
      </View>

      {/* Habits list */}
      <Text style={styles.sectionTitle}>Today's Habits</Text>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      {/* Explore Articles */}
      <Text style={styles.sectionTitle}>Explore</Text>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tracker')}
      >
        <Text style={styles.buttonText}>Go to Tracker</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

// styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { padding: 24, paddingTop: 80 },
  date: { fontSize: 20, color: '#6B7280', marginBottom: 4 },
  greeting: { fontSize: 26, fontWeight: '700', color: '#2563EB' },
  message: { fontSize: 16, color: '#1F2937', marginTop: 8, marginBottom: 24 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '47%',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardBlue: { backgroundColor: '#2563EB' },
  cardAmber: { backgroundColor: '#FCD34D', position: 'relative' },
  cardDark: { backgroundColor: '#1F2937' },
  cardTitle: { fontSize: 18, color: '#fff', fontWeight: '600', marginTop: 10 },
  cardSubtitle: { fontSize: 14, color: '#E5E7EB', marginTop: 4 },
  cardTitleDark: { fontSize: 18, color: '#1F2937', fontWeight: '600', marginTop: 10 },
  cardSubtitleDark: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  cardTitleLight: { fontSize: 18, color: '#FAFAFA', fontWeight: '600', marginTop: 10 },
  cardSubtitleLight: { fontSize: 14, color: '#D1D5DB', marginTop: 4 },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  progressSection: { alignItems: 'center', marginBottom: 24 },
  summaryText: { marginTop: 8, fontSize: 16, color: '#1F2937' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#F59E0B', marginBottom: 12 },
  habitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  habitText: { marginLeft: 10, fontSize: 16, color: '#1F2937' },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 40,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  articleImage: { width: '100%', height: 140 },
  articleTextBlock: { padding: 14 },
  articleTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  articleSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
})
