import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@/components/ThemeContext';

const StatisticBar = ({ statistics, customStyles, ownText }) => {
  const { colors: themeColors } = useTheme(); // Theme integration
  const [pressedType, setPressedType] = useState(null);
  const screenWidth = Dimensions.get('window').width * 0.75;

  // Theme-aware activity colors
  const activityColors   = {
  Sport: '#EF5350',
  Work: '#66BB6A',
  Study: '#42A5F5',
  Family: '#FFA726',
  Travel: '#AB47BC',
  Relax: '#EC407A',
  Social: '#FFEE58',
  Hobby: '#26C6DA',
};

  const icons = {
    Sport: { iconSet: AntDesign, name: 'dribbble' },
    Work: { iconSet: MaterialIcons, name: 'work' },
    Study: { iconSet: FontAwesome, name: 'book' },
    Family: { iconSet: AntDesign, name: 'home' },
    Travel: { iconSet: MaterialIcons, name: 'flight-takeoff' },
    Relax: { iconSet: FontAwesome, name: 'bed' },
    Social: { iconSet: AntDesign, name: 'team' },
    Hobby: { iconSet: MaterialIcons, name: 'palette' },
  };

  const total = Object.values(statistics).reduce((sum, count) => sum + count, 0);

  const styles = StyleSheet.create({
    container: {
      width: screenWidth,
      marginVertical: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeColors.onSurface,
      marginBottom: 10,
      textAlign: 'center',
    },
    barContainer: {
      height: 24,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: themeColors.surfaceVariant || '#eee',
      marginBottom: 15,
      position: 'relative',
    },
    tooltip: {
      position: 'absolute',
      top: -40,
      backgroundColor: themeColors.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 99,
      elevation: 10,
      maxWidth: 180,
      borderColor: themeColors.outline,
      borderWidth: 1,
    },
    tooltipText: {
      color: themeColors.onSurface,
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
      color: themeColors.onSurface,
      fontWeight: 'bold',
    },
    noAssignmentsText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: themeColors.onSurface,
      textAlign: 'center',
      marginTop: 20,
    },
  });

  // Lighten hex color only
  const lightenColor = (hex) => {
    if (!hex || !hex.startsWith('#')) return hex; // Skip non-hex colors
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, r + (255 - r) * 0.3);
    g = Math.min(255, g + (255 - g) * 0.3);
    b = Math.min(255, b + (255 - b) * 0.3);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  let runningLeft = 0;

  if (Object.keys(statistics).length === 0) {
    return (
      <View style={[styles.container, customStyles]}>
        <Text style={styles.title}>{ownText}</Text>
        <Text style={styles.noAssignmentsText}>You had no assignments</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, customStyles]}>
      <Text style={styles.title}>{ownText}</Text>

      <View style={styles.barContainer}>
        {Object.entries(statistics).map(([type, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const width = (screenWidth * percentage) / 100;
          const baseColor = activityColors[type];
          const color = pressedType === type ? lightenColor(baseColor) : baseColor;
          const { iconSet: IconSet, name } = icons[type] || {};

          const left = runningLeft;
          runningLeft += width;

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
                    <IconSet name={name} size={18} color={baseColor} style={{ marginRight: 6 }} />
                  )}
                  <Text style={styles.tooltipText}>
                    {type}: {Math.round(percentage)}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legendContainer}>
        {Object.entries(statistics).map(([type, count]) => {
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          const { iconSet: IconSet, name } = icons[type] || {};
          return (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: activityColors[type] }]} />
              {IconSet && <IconSet name={name} size={14} color={activityColors[type]} style={{ marginRight: 5 }} />}
              <Text style={styles.legendText}>{type}: {count} ({percent}%)</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StatisticBar;
