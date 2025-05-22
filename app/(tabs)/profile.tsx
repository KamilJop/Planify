import { View, ScrollView, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonIcon } from '@/components/ui/button';
import { TrashIcon } from '@/components/ui/icon';
import dayjs from 'dayjs';
import StatisticBar from '@/components/statisticbar.js';
import { useTheme } from '@/components/ThemeContext';

const Profile = () => {
  const { colors } = useTheme();
  const [upcomingAssignments, setUpcomingAssignments] = useState<Array<{
    date: string;
    title: string;
    time: string;
    type: string;
    description?: string;
  }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [statistics, setStatistics] = useState<{
    currentMonth: Record<string, number>;
    lastMonth: Record<string, number>;
    currentYear: Record<string, number>;
  }>({
    currentMonth: {},
    lastMonth: {},
    currentYear: {}
  });
  
  const loadAssignments = async () => {
    setRefreshing(true);
    try {
      const stored = await AsyncStorage.getItem('assignments');
      if (stored) {
        const assignments = JSON.parse(stored);
        const today = dayjs();
        const currentMonth = today.month();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const currentYear = today.year();
  
        const stats = {
          currentMonth: {} as Record<string, number>,
          lastMonth: {} as Record<string, number>,
          currentYear: {} as Record<string, number>,
        };
  
        const upcoming = Object.entries(assignments)
          .flatMap(([date, dateAssignments]) => 
            (dateAssignments as any[]).map(assignment => ({ ...assignment, date }))
          )
          .filter(assignment => {
            const assignmentDate = dayjs(assignment.date);
            const month = assignmentDate.month();
            const year = assignmentDate.year();
            const type = assignment.type;
  
            if (year === currentYear) {
              stats.currentYear[type] = (stats.currentYear[type] || 0) + 1;
              if (month === currentMonth) {
                stats.currentMonth[type] = (stats.currentMonth[type] || 0) + 1;
              }
              if (month === lastMonth && (currentMonth !== 0 || year === currentYear)) {
                stats.lastMonth[type] = (stats.lastMonth[type] || 0) + 1;
              }
            }
  
            return assignment.date >= today.format('YYYY-MM-DD');
          })
          .sort((a, b) => {
            const dateCompare = dayjs(a.date).diff(dayjs(b.date));
            if (dateCompare !== 0) return dateCompare;
            const timeA = a.time?.replace(':', '') || '0000';
            const timeB = b.time?.replace(':', '') || '0000';
            return timeA.localeCompare(timeB);
          });
  
        setUpcomingAssignments(upcoming);
        setStatistics(stats);
      } else {
        setUpcomingAssignments([]);
        setStatistics({
          currentMonth: {},
          lastMonth: {},
          currentYear: {},
        });
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDeleteAssignment = async (assignmentToDelete: any) => {
    try {
      const stored = await AsyncStorage.getItem('assignments');
      if (stored) {
        const assignments = JSON.parse(stored);
        const dateKey = assignmentToDelete.date;
        
        if (assignments[dateKey]) {
          const updatedAssignmentsForDate = assignments[dateKey].filter(
            (a: any) => !(
              a.title === assignmentToDelete.title && 
              a.time === assignmentToDelete.time && 
              a.type === assignmentToDelete.type
            )
          );
          
          const updatedAssignments = {
            ...assignments,
            [dateKey]: updatedAssignmentsForDate
          };
          
          if (updatedAssignmentsForDate.length === 0) {
            delete updatedAssignments[dateKey];
          }
          
          await AsyncStorage.setItem('assignments', JSON.stringify(updatedAssignments));
          loadAssignments();
        }
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch {
      return timeString;
    }
  };

  const profileImage = require('@/assets/images/profile-image.jpg');

  return (
    <ScrollView 
      style={{flex: 1, backgroundColor: colors.background, minHeight: Dimensions.get('window').height}} 
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadAssignments}
          tintColor={colors.primary}
        />
      }
    >
      <View style={[styles.profileContainer, { backgroundColor: colors.surface, marginTop: 50 }]}>
        <Image 
          source={profileImage} 
          alt="Profile Image" 
          style={styles.profileImage}
        />
        
        <View style={[styles.assignmentsHeader, { backgroundColor: colors.surface }]}>
          <Text style={[styles.headerText, { color: colors.textColor }]}>Upcoming assignments</Text>
          
          {upcomingAssignments.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textColor }]}>No upcoming assignments</Text>
          ) : (
            <View style={styles.assignmentsContainer}>
              {upcomingAssignments.map((assignment, index) => (
                <View key={index} style={[styles.assignmentItem, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.onSurface + '20'
                }]}>
                  <View style={styles.assignmentInfo}>
                    <Text style={[styles.assignmentDate, { color: colors.primary }]}>
                      {dayjs(assignment.date).format('MMM D, YYYY')} at {formatTime(assignment.time)}
                    </Text>
                    <Text style={[styles.assignmentTitle, { color: colors.onSurface }]}>
                      {assignment.title}
                    </Text>
                    {assignment.description && (
                      <Text style={[styles.assignmentDescription, { color: colors.onSurface }]}>
                        {assignment.description}
                      </Text>
                    )}
                    <Text style={[styles.assignmentType, { color: colors.onSurface }]}>
                      Type: {assignment.type}
                    </Text>
                  </View>
                  <Button 
                    onPress={() => handleDeleteAssignment(assignment)}
                    style={styles.deleteButton}
                  >
                    <ButtonIcon 
                      as={TrashIcon}
                      size="md" 
                      color={colors.error} 
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>
                </View>
              ))}
            </View>
          )}
          <StatisticBar 
            statistics={statistics.currentMonth}
            customStyles={{ marginBottom: 20, }}
            ownText={"This Month's Assignments"} 
          />
          <StatisticBar 
            statistics={statistics.lastMonth}
            customStyles={{ marginBottom: 20 }}
            ownText={"Last Month's Assignments"} 
          />
          <StatisticBar 
            statistics={statistics.currentYear}
            customStyles={{ marginBottom: 20 }}
            ownText={"This Year's Assignments"} 
          />
        </View>    
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  assignmentsHeader: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assignmentsContainer: {
    width: '100%',
    marginTop: 20,
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentDate: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  assignmentDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  assignmentType: {
    fontSize: 14,
    opacity: 0.8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Profile;