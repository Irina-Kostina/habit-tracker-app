// components/HabitStatsChart.tsx
import React from 'react'
import { View, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

export default function HabitStatsChart() {
  return (
    <View>
      <LineChart
        data={{
          labels: ['01', '02', '03', '04', '05', '06'],
          datasets: [{ data: [80, 60, 70, 90, 75, 85] }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#1f1f1f',
          backgroundGradientTo: '#1f1f1f',
          color: () => '#4da6ff',
          labelColor: () => '#aaa',
        }}
        bezier
        style={{ borderRadius: 12 }}
      />
    </View>
  )
}
