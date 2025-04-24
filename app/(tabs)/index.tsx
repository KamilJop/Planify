import { useState, useEffect } from 'react';
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
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';



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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    minHeight: Dimensions.get('window').height,
  },
  calendarContainer: {
    width: width * 0.9,
    marginTop: 60,
  },
  calendar: {
    borderWidth: 1,
    borderColor: Colors.surface,
    backgroundColor: Colors.surface,
    height: 365,
    borderRadius: 16,
    overflow: 'hidden',
  },
  assignmentsContainer: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderRadius: 16,
    backgroundColor: Colors.surface,
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
    color: Colors.onSurface,
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
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    width: 60,
    height: 70,
  },
  timeText: {
    fontWeight: 'bold',
    color: Colors.onBackground,
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
    color: Colors.onSurface,
  },
  assignmentDescription: {
    fontSize: 14,
    color: Colors.onSurface + 'AA',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: Colors.surface,
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
    color: Colors.onSurface,
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
    borderBottomColor: Colors.primary,
    color: Colors.onSurface,
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
    color: Colors.onSurface,
    marginHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 8,
  },
  emptyStateText: {
    color: Colors.onSurface + 'AA',
    fontStyle: 'italic',
  },
});

export default function HomeScreen() {
  const [selected, setSelected] = useState<DateType | Dayjs>(dayjs());
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });
  const [assignmentTypeSelected, setAssignmenTypeSelected] = useState('');
  const [time, setTime] = useState(new Date());
  const [timeArray, setTimeArray] = useState<string[]>(['1', '2', '0', '0']);
  const [displayTime, setDisplayTime] = useState('');
  const [refreshing, setRefreshing] = useState(false); 

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
      value: time || new Date(0, 0, 0, 12, 0), // Default to 12:00 if no time is set
      mode: 'time',
      display: 'spinner',
      is24Hour: true,
      minuteInterval: 10,
      onChange: (event, selectedTime) => {
        if (event.type === 'set') {
          const currentTime = selectedTime || new Date(0, 0, 0, 12, 0); // Default to 12:00
          setTime(currentTime);
          const hours = currentTime.getHours();
          const minutes = currentTime.getMinutes();
          const timeDigits = [
            ...hours.toString().split(''),
            ...minutes.toString().split(''),
          ];
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
    
    // Get time - default to 12:00 if not set
    let formattedTime = "12:00";
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      formattedTime = `${hours}:${minutes}`;
    }
  
    const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
    const updated = {
      ...assignments,
      [dateKey]: [
        ...(assignments[dateKey] || []),
        {
          ...newAssignment,
          date: dateKey,
          time: formattedTime, // Will be either the selected time or "12:00"
          type: assignmentTypeSelected,
        },
      ],
    };
    
    setAssignments(updated);
    await AsyncStorage.setItem('assignments', JSON.stringify(updated));
    setNewAssignment({ title: '', description: '' });
    setAssignmenTypeSelected('');
    setTime(new Date());
    setTimeArray(['1', '2', '0', '0']);
    setIsModalVisible(false);
  };

  const handleDeleteAssignment = async (assignment: Assignment): Promise<void> => {
  const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
  const updatedAssignments = { ...assignments };
  
  // Filter out the deleted assignment
  updatedAssignments[dateKey] = (updatedAssignments[dateKey] || []).filter((a) => a !== assignment);
  
  // Remove the date key if no assignments left
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
    <ScrollView
    style={styles.container}
    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={Colors.primary}
      />
    }
  >
      <View style={styles.calendarContainer}>
      <Calendar
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
          dotColor: RadioColors[assignments[date][0].type as keyof typeof RadioColors] || Colors.primary
        };
      }
      return acc;
    }, {} as Record<string, { marked: boolean; dotColor: string }>),
    ...(selected && {
      [format(convertToDate(selected), 'yyyy-MM-dd')]: {
        selected: true,
        selectedColor: Colors.primary,
        marked: assignments[format(convertToDate(selected), 'yyyy-MM-dd')]?.length > 0,
        dotColor: assignments[format(convertToDate(selected), 'yyyy-MM-dd')]?.length > 0
          ? RadioColors[assignments[format(convertToDate(selected), 'yyyy-MM-dd')][0].type as keyof typeof RadioColors]
          : Colors.primary,
      },
    }),
  }}
  theme={{
    backgroundColor: Colors.surface,
    calendarBackground: Colors.surface,
    textSectionTitleColor: Colors.onSurface,
    selectedDayBackgroundColor: Colors.primary,
    selectedDayTextColor: Colors.onPrimary,
    todayTextColor: Colors.secondary,
    dayTextColor: Colors.onSurface,
    textDisabledColor: Colors.onSurface + '55',
    dotColor: Colors.primary,
    arrowColor: Colors.primary,
    monthTextColor: Colors.onSurface,
    textDayFontWeight: 'bold',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: 'bold',
  }}
/>

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
                  style={{ width: 24, height: 24, color: Colors.primary }}
                />
              </Button>
            </View>

            {sortedAssignments.length === 0 ? (
              <Text style={styles.emptyStateText}>No assignments for this day</Text>
            ) : (
              <View>
                {sortedAssignments.map((assignment, index) => (
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
                          backgroundColor: RadioColors[assignment.type as keyof typeof RadioColors] || Colors.background,
                          borderColor: RadioColors[assignment.type as keyof typeof RadioColors] || Colors.background,
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
                              style={{ width: 24, height: 24, color: Colors.onSurface }}
                            />
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Assignment</Text>
            <View style={styles.radioButtonContainer}>
              {RadioData.map((item, index) => (
                <View key={index} style={styles.radioButtonWrapper}>
                  <RadioButton
                    data={[item]}
                    onSelect={setAssignmenTypeSelected}
                    value={assignmentTypeSelected}
                  />
                </View>
              ))}
            </View>
            <TextInput
              placeholder="Title *"
              placeholderTextColor={Colors.onSurface + '77'}
              value={newAssignment.title}
              onChangeText={(text) =>
                setNewAssignment((prev) => ({ ...prev, title: text }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={Colors.onSurface + '77'}
              value={newAssignment.description}
              onChangeText={(text) =>
                setNewAssignment((prev) => ({ ...prev, description: text }))
              }
              style={styles.input}
              multiline
            />
            <Pressable onPress={showTimePicker}>
              <View style={styles.timePickerContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <HourBox value={timeArray[0]} />
                  <HourBox value={timeArray[1]} />
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={{ flexDirection: 'row' }}>
                  <HourBox value={timeArray[2]} />
                  <HourBox value={timeArray[3]} />
                </View>
              </View>
            </Pressable>
            <View style={styles.modalButtons}>
              <Button variant="outline" className='bg-red-500' onPress={() => setIsModalVisible(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button variant="outline" className='bg-green-400' onPress={handleAddAssignment}>
                <ButtonText>Save</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}