import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const StatisticBar = ({ statistics, customStyles, ownText }) => {
  const [pressedType, setPressedType] = useState(null)

  const screenWidth = Dimensions.get('window').width * 0.75

  const colors = {
    Sport: '#FF5733',
    Work: '#33FF57',
    Study: '#3357FF',
    Family: '#FF33A1',
    Travel: '#FF8C33',
    Relax: '#33FFF5',
    Social: '#F533FF',
    Hobby: '#FFC733',
  }

  const icons = {
    Sport: { iconSet: AntDesign, name: 'dribbble', color: '#FF5733' },
    Work: { iconSet: MaterialIcons, name: 'work', color: '#33FF57' },
    Study: { iconSet: FontAwesome, name: 'book', color: '#3357FF' },
    Family: { iconSet: AntDesign, name: 'home', color: '#FF33A1' },
    Travel: { iconSet: MaterialIcons, name: 'flight-takeoff', color: '#FF8C33' },
    Relax: { iconSet: FontAwesome, name: 'bed', color: '#33FFF5' },
    Social: { iconSet: AntDesign, name: 'team', color: '#F533FF' },
    Hobby: { iconSet: MaterialIcons, name: 'palette', color: '#FFC733' },
  }

  const total = Object.values(statistics).reduce((sum, count) => sum + count, 0)

  const styles = StyleSheet.create({
    container: {
      width: screenWidth,
      marginVertical: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
      textAlign: 'center',
    },
    barContainer: {
      height: 24,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#eee',
      marginBottom: 15,
      position: 'relative',
    },
    tooltip: {
      position: 'absolute',
      top: -40,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 99,
      elevation: 10,
      maxWidth: 180,
    },
    tooltipText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 5,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 5,
    },
    legendText: {
      fontSize: 12,
      color: 'white',
      fontStyle: 'bold',
    },
    noAssignmentsText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: 'gray',
      textAlign: 'center',
      marginTop: 20,
    },
  })

  const lightenColor = (hex) => {
    hex = hex.replace('#', '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)
    r = Math.min(255, r + (255 - r) * 0.3)
    g = Math.min(255, g + (255 - g) * 0.3)
    b = Math.min(255, b + (255 - b) * 0.3)
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
  }

  let runningLeft = 0

  if (Object.keys(statistics).length === 0) {
    return (
      <View style={[styles.container, customStyles]}>
        <Text style={styles.title}>{ownText}</Text>
        <Text style={styles.noAssignmentsText}>You had no assignments</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, customStyles]}>
      <Text style={styles.title}>{ownText}</Text>

      <View style={styles.barContainer}>
        {Object.entries(statistics).map(([type, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          const width = (screenWidth * percentage) / 100
          const color = pressedType === type ? lightenColor(colors[type]) : colors[type]
          const { iconSet: IconSet, name, color: iconColor } = icons[type] || {}

          const left = runningLeft
          runningLeft += width

          return (
            <TouchableOpacity
              key={type}
              style={{ width, backgroundColor: color }}
              onPressIn={() => setPressedType(type)}
              onPressOut={() => setPressedType(null)}
              activeOpacity={1}
            >
              {pressedType === type && (
                <View style={[styles.tooltip, { left: Math.max(5, left + width / 2 - 90) }]}>
                  {IconSet && (
                    <IconSet name={name} size={18} color={iconColor} style={{ marginRight: 6 }} />
                  )}
                  <Text style={styles.tooltipText}>
                    {type}: {Math.round(percentage)}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.legendContainer}>
        {Object.entries(statistics).map(([type, count]) => {
          const percent = total > 0 ? Math.round((count / total) * 100) : 0
          const { iconSet: IconSet, name, color } = icons[type] || {}
          return (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors[type] }]} />
              {IconSet && <IconSet name={name} size={14} color={color} style={{ marginRight: 5 }} />}
              <Text style={styles.legendText}>{type}: {count} ({percent}%)</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default StatisticBar
