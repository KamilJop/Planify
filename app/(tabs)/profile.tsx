import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonIcon } from '@/components/ui/button';
import { TrashIcon } from '@/components/ui/icon';
import dayjs from 'dayjs';

const Profile = () => {
  const Colors = {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    error: '#CF6679',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
  };

  const [upcomingAssignments, setUpcomingAssignments] = useState<Array<{
    date: string;
    title: string;
    time: string;
    type: string;
    description?: string;
  }>>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAssignments = async () => {
    setRefreshing(true);
    try {
      const stored = await AsyncStorage.getItem('assignments');
      if (stored) {
        const assignments = JSON.parse(stored);
        const today = dayjs().format('YYYY-MM-DD');

        const upcoming = Object.entries(assignments)
          .flatMap(([date, assignments]) => 
            (assignments as any[]).map(a => ({ ...a, date }))
          .filter(assignment => assignment.date >= today)
          .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            
            const timeA = a.time.replace(':', '');
            const timeB = b.time.replace(':', '');
            return timeA.localeCompare(timeB);
          }));
          
        setUpcomingAssignments(upcoming);
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
          const updatedAssignments = {
            ...assignments,
            [dateKey]: assignments[dateKey].filter(
              (a: any) => !(
                a.title === assignmentToDelete.title && 
                a.time === assignmentToDelete.time && 
                a.type === assignmentToDelete.type
              )
            )
          };
          
          await AsyncStorage.setItem('assignments', JSON.stringify(updatedAssignments));
          loadAssignments(); // Refresh the list after deletion
        }
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    
    // If time is already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // Handle cases where time might be in different formats
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch {
      return timeString; // fallback
    }
  };

  const profileImage = require('@/assets/images/profile-image.jpg');

  return (
    <ScrollView 
      style={{flex: 1, backgroundColor: Colors.background, minHeight: Dimensions.get('window').height}} 
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadAssignments}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={[styles.profileContainer, { backgroundColor: Colors.surface, marginTop: 50 }]}>
        <Image 
          source={profileImage} 
          alt="Profile Image" 
          style={styles.profileImage}
        />
        
        <View style={[styles.assignmentsHeader, { backgroundColor: Colors.surface }]}>
          <Text style={styles.headerText}>Upcoming assignments</Text>
          
          {upcomingAssignments.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming assignments</Text>
          ) : (
            <View style={styles.assignmentsContainer}>
              {upcomingAssignments.map((assignment, index) => (
                <View key={index} style={[styles.assignmentItem, { backgroundColor: Colors.surface }]}>
                  <View style={styles.assignmentInfo}>
                    <Text style={[styles.assignmentDate, { color: Colors.primary }]}>
                      {dayjs(assignment.date).format('MMM D, YYYY')} at {formatTime(assignment.time)}
                    </Text>
                    <Text style={[styles.assignmentTitle, { color: Colors.onSurface }]}>
                      {assignment.title}
                    </Text>
                    {assignment.description && (
                      <Text style={[styles.assignmentDescription, { color: Colors.onSurface }]}>
                        {assignment.description}
                      </Text>
                    )}
                    <Text style={[styles.assignmentType, { color: Colors.onSurface }]}>
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
                      color={Colors.error} 
                      style={{ width: 24, height: 24 }}/>
                  </Button>
                </View>
              ))}
            </View>
          )}
        </View>    
      </View>
    </ScrollView>
  )
}

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
    color: 'white',
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
    borderColor: '#333',
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
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Profile