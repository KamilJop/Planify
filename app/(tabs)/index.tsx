import { useState, useEffect } from 'react';
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import DateTimePicker, { useDefaultStyles, DateType } from 'react-native-ui-datepicker';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { AddIcon, TrashIcon } from '@/components/ui/icon';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import RadioButton from '@/components/radiobutton';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import HourBox from '@/components/hourbox';
import { Calendar } from 'react-native-calendars';
import { DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';





type Assignment = {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
};

const width = Dimensions.get('window').width;

const RadioColors = {
  Sport: '#EF5350',
  Work: '#66BB6A',
  Study: '#42A5F5',
  Family: '#FFA726',
  Travel: '#AB47BC',
  Relax: '#EC407A',
  Social: '#FFEE58',
  Hobby: '#26C6DA',
};



export default function HomeScreen() {
  const [selected, setSelected] = useState<DateType | Dayjs>(dayjs());
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });
  const [assignmentTypeSelected, setAssignmenTypeSelected] = useState('');
  const [time, setTime] = useState(new Date());
  const [timeArray, setTimeArray] = useState<string[]>(['1', '2', '0', '0']);
  const [displayTime, setDisplayTime] = useState('12:00');
  const [refreshing, setRefreshing] = useState(false); 
  const [isTimePicked, setIsTimePicked] = useState(false);
  const { colors } = useTheme();
  const { accent } = useTheme();
  const [animationKey, setAnimationKey] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      setAnimationKey(prevKey => prevKey + 1);
      return () => {};
    }, [])
  );
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    minHeight: Dimensions.get('window').height,
  },
  calendarContainer: {
    width: width * 0.9,
    marginTop: 60,
  },
  calendar: {
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    height: 365,
    borderRadius: 16,
    overflow: 'hidden',
  },
  assignmentsContainer: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  assignmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  assignmentsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.onSurface,
  },
  assignmentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    width: 60,
    height: 70,
  },
  timeText: {
    fontWeight: 'bold',
    color: colors.onBackground,
  },
  assignmentContent: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
  assignmentTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  assignmentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.onSurface,
  },
  assignmentDescription: {
    fontSize: 14,
    color: colors.onSurface + 'AA',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    width: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: colors.onSurface,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioButtonWrapper: {
    width: '22%',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    color: colors.onSurface,
    minWidth: 160,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 8,
  },
  emptyStateText: {
    color: colors.onSurface + 'AA',
    fontStyle: 'italic',
  },
});
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    setCalendarKey(prev => prev + 1);
  }, [colors,accent]);


  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const stored = await AsyncStorage.getItem('assignments');
        if (stored) {
          const parsed = JSON.parse(stored);
          setAssignments(parsed);
        }
      } catch (error) {
        console.error('Failed to load assignments:', error);
      }
    };

    loadAssignments();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const stored = await AsyncStorage.getItem('assignments');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAssignments(parsed);
      }
    } catch (error) {
      console.error('Failed to refresh assignments:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
  },  [assignments]);
  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: time || new Date(0, 0, 0, 12, 0),
      mode: 'time',
      display: 'spinner',
      is24Hour: true,
      minuteInterval: 10,
      onChange: (event, selectedTime) => {
  if (event.type === 'set') {
    const currentTime = selectedTime || new Date(0, 0, 0, 12, 0);
    setIsTimePicked(true); // <- Track user interaction
    setTime(currentTime);
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeDigits = [...hours.toString().split(''), ...minutes.toString().split('')];
    setTimeArray(timeDigits);
    setDisplayTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
  }
},
    });
  };
  
  const RadioData = [
    { value: 'Sport' },
    { value: 'Work' },
    { value: 'Study' },
    { value: 'Family' },
    { value: 'Travel' },
    { value: 'Relax' },
    { value: 'Social' },
    { value: 'Hobby' },
  ];

  const convertToDate = (date: DateType | Dayjs): Date => {
    if (!date) throw new Error('Invalid date');
    return dayjs.isDayjs(date) ? date.toDate() : new Date(date);
  };

 const handleAddAssignment = async (): Promise<void> => {
  if (!selected || !newAssignment.title.trim()) return;

  let assignmentTime: Date;
  if (isTimePicked) {
    assignmentTime = time;
  } else {
    assignmentTime = new Date();
    assignmentTime.setHours(12, 0, 0, 0); // Set to 12:00
  }

  const hours = assignmentTime.getHours().toString().padStart(2, '0');
  const minutes = assignmentTime.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
  const updated = {
    ...assignments,
    [dateKey]: [
      ...(assignments[dateKey] || []),
      {
        ...newAssignment,
        date: dateKey,
        time: formattedTime,
        type: assignmentTypeSelected,
      },
    ],
  };

  setAssignments(updated);
  await AsyncStorage.setItem('assignments', JSON.stringify(updated));
  setNewAssignment({ title: '', description: '' });
  setAssignmenTypeSelected('');
  setTime(new Date(0, 0, 0, 12, 0));
  setTimeArray(['1', '2', '0', '0']);
  setDisplayTime('12:00');
  setIsTimePicked(false); // Reset on save
  setIsModalVisible(false);
};
  const handleDeleteAssignment = async (assignment: Assignment): Promise<void> => {
  const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
  const updatedAssignments = { ...assignments };
  

  updatedAssignments[dateKey] = (updatedAssignments[dateKey] || []).filter((a) => a !== assignment);
  

  if (updatedAssignments[dateKey]?.length === 0) {
    delete updatedAssignments[dateKey];
  }
  
  setAssignments(updatedAssignments);
  await AsyncStorage.setItem('assignments', JSON.stringify(updatedAssignments));
};

  const selectedDateKey = selected ? format(convertToDate(selected), 'yyyy-MM-dd') : '';
  const selectedDateAssignments = assignments[selectedDateKey] || [];

  // Sort assignments by time (ascending)
  const sortedAssignments = selectedDateAssignments.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''), 10);
    const timeB = parseInt(b.time.replace(':', ''), 10);
    return timeA - timeB;
  });

  return (
  <Animatable.View 
    key={`container-${animationKey}`}
    animation="fadeInUp" 
    duration={500}
    style={{ flex: 1 }} // Ensure full height
  >
  <ScrollView
    style={styles.container}
    contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 120 }} // Increased paddingBottom
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors.primary}
      />
    }
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.calendarContainer}>

        <Animatable.View 
          key={`calendar-${animationKey}`}
          animation="bounceIn" 
          duration={400}
        >
      <Calendar
      key ={calendarKey}
  style={styles.calendar}
  onDayPress={(day: DateData) => {
    setSelected(dayjs(day.dateString));
  }}
  markedDates={{
    ...Object.keys(assignments).reduce((acc, date) => {
      // Only mark dates that have at least one assignment
      if (assignments[date]?.length > 0) {
        acc[date] = { 
          marked: true,
          dotColor: RadioColors[assignments[date][0].type as keyof typeof RadioColors] || colors.primary
        };
      }
      return acc;
    }, {} as Record<string, { marked: boolean; dotColor: string }>),
    ...(selected && {
      [format(convertToDate(selected), 'yyyy-MM-dd')]: {
        selected: true,
        selectedColor: accent,
        marked: assignments[format(convertToDate(selected), 'yyyy-MM-dd')]?.length > 0,
        dotColor: assignments[format(convertToDate(selected), 'yyyy-MM-dd')]?.length > 0
          ? RadioColors[assignments[format(convertToDate(selected), 'yyyy-MM-dd')][0].type as keyof typeof RadioColors]
          : accent,
      },
    }),
  }}
  theme={{
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.onSurface,
    selectedDayBackgroundColor: accent,
    selectedDayTextColor: colors.onPrimary,
    todayTextColor: colors.secondary,
    dayTextColor: colors.onSurface,
    textDisabledColor: colors.onSurface + '55',
    dotColor: accent,
    arrowColor: accent,
    monthTextColor: colors.onSurface,
    textDayFontWeight: 'bold',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: 'bold',
  }}
/>
</Animatable.View>

        {selected && (
          <View style={styles.assignmentsContainer}>
            <View style={styles.assignmentsHeader}>
              <Text style={styles.assignmentsTitle}>
                Assignments for {format(convertToDate(selected), 'MMM dd, yyyy')}
              </Text>
              <Button onPress={() => setIsModalVisible(true)}>
                <ButtonIcon
                  as={AddIcon}
                  size="md"
                  style={{ width: 24, height: 24, color: accent }}
                />
              </Button>
            </View>

            {sortedAssignments.length === 0 ? (
              <Text style={styles.emptyStateText}>No assignments for this day</Text>
            ) : (
              <View>
                {sortedAssignments.map((assignment, index) => (
                  <Animatable.View 
              key={`assignment-${index}-${animationKey}`}
              animation="fadeInUp"
              duration={800}
              delay={index * 100}
              style={{ 
                margin: 10, 
                padding: 10, 
                borderRadius: 10, 
                backgroundColor: RadioColors[assignment.type as keyof typeof RadioColors] || colors.background,
              }}
            >
                  <View key={index} style={styles.assignmentItem}>
                    <View style={styles.timeBox}>
                      <Text style={styles.timeText}>
                        {assignment.time || '12:00'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.assignmentContent,
                        {
                          backgroundColor: RadioColors[assignment.type as keyof typeof RadioColors] || colors.background,
                          borderColor: RadioColors[assignment.type as keyof typeof RadioColors] || colors.background,
                        },
                      ]}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.assignmentTextContainer}>
                          <Text style={styles.assignmentTitle}>
                            {assignment.title}
                          </Text>
                          {assignment.description && (
                            <Text style={styles.assignmentDescription}>
                              {assignment.description}
                            </Text>
                          )}
                        </View>
                        <View>
                          <Button onPress={() => handleDeleteAssignment(assignment)}>
                            <ButtonIcon
                              as={TrashIcon}
                              size="md"
                              style={{ width: 24, height: 24, color: colors.onSurface }}
                            />
                          </Button>
                        </View>
                        
                      </View>
                    </View>
                  </View>
                  </Animatable.View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

<Modal visible={isModalVisible} transparent>
  <Animatable.View 
    animation="fadeIn"
    duration={300}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}
  >
    <Animatable.View 
      animation="bounceIn"
      duration={600}
      style={{ 
        backgroundColor: colors.surface, 
        padding: 20, 
        borderRadius: 10,
        width: width * 0.85 // Slightly wider for better form display
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.onSurface, marginBottom: 15 }}>
        New Assignment
      </Text>
      
      {/* Radio Buttons - Animated */}
      <Animatable.View 
        animation="fadeInRight"
        duration={400}
        delay={100}
        style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}
      >
        {RadioData.map((item, idx) => (
          <RadioButton 
            key={idx} 
            data={[item]} 
            onSelect={setAssignmenTypeSelected} 
            value={assignmentTypeSelected} 
          />
        ))}
      </Animatable.View>

      {/* Title Input - Animated */}
      <Animatable.View animation="fadeInRight" duration={400} delay={200}>
        <TextInput
          placeholder="Title *"
          placeholderTextColor={colors.onSurface + '80'}
          value={newAssignment.title}
          onChangeText={(text) => setNewAssignment({ ...newAssignment, title: text })}
          style={{ 
            borderBottomColor: colors.primary, 
            borderBottomWidth: 1, 
            marginBottom: 15, 
            color: colors.onSurface,
            fontSize: 16,
            paddingVertical: 8
          }}
        />
      </Animatable.View>

      {/* Description Input - Animated */}
      <Animatable.View animation="fadeInRight" duration={400} delay={300}>
        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.onSurface + '80'}
          value={newAssignment.description}
          onChangeText={(text) => setNewAssignment({ ...newAssignment, description: text })}
          style={{ 
            borderBottomColor: colors.primary, 
            borderBottomWidth: 1, 
            marginBottom: 15, 
            color: colors.onSurface,
            fontSize: 16,
            paddingVertical: 8
          }}
        />
      </Animatable.View>

      {/* Time Picker - Animated */}
      <Animatable.View animation="fadeInRight" duration={400} delay={400}>
        <Pressable 
          onPress={showTimePicker}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <Text style={{ fontSize: 16, color: colors.primary, marginRight: 10 }}>
            Time:
          </Text>
          <Text style={{ fontSize: 18, color: colors.primary, fontWeight: 'bold' }}>
            {displayTime}
          </Text>
        </Pressable>
      </Animatable.View>

      {/* Buttons - Animated */}
      <Animatable.View 
        animation="fadeInUp"
        duration={500}
        delay={500}
        style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}
      >
        <Button 
          variant="outline" 
          onPress={() => setIsModalVisible(false)}
          style={{ borderColor: colors.primary }}
        >
          <ButtonText style={{ color: colors.primary }}>Cancel</ButtonText>
        </Button>
        <Button 
          onPress={handleAddAssignment}
          style={{ backgroundColor: colors.primary }}
          disabled={!newAssignment.title.trim()}
        >
          <ButtonText style={{ color: colors.onPrimary }}>Save</ButtonText>
        </Button>
      </Animatable.View>
    </Animatable.View>
  </Animatable.View>
</Modal>
    </ScrollView>
    </Animatable.View>
  );
}