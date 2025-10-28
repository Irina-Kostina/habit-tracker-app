import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ArticleDetails({ route, navigation }: any) {
  // Receive data from Home screen
  const { title, subtitle, image, content } = route.params

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button - stays at top */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#2563EB" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Main Scrollable Content */}
      <ScrollView style={styles.scroll}>
        {/* Add top space between button and image */}
        <View style={{ height: 50 }} />

        {/* Article image */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* Article text section */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.content}>
            {content ||
              `This is a full article about psychology and motivation. Here you can add detailed text later, 
like advice on building good habits, understanding behaviour patterns, and staying consistent. 
The text can be long and scrollable.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // Ensures screen content is below notch or status bar
  safeContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  scroll: {
    flex: 1,
  },

  // Fixed back button at the top (not on image)
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60, // below notch
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },

  // Article image positioned below the button
  image: {
    width: '100%',
    height: 230,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 0,
  },

  textBlock: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },

  content: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
})
