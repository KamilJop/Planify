import { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ViewStyle,
} from 'react-native';
import DateTimePicker, { useDefaultStyles, DateType } from 'react-native-ui-datepicker';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { AddIcon, TrashIcon } from '@/components/ui/icon';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import RadioButton from '@/components/radiobutton';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import HourBox from '@/components/hourbox';

type Assignment = {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
};

const width = Dimensions.get('window').width;

// Define colors for each assignment type
const RadioColors = {
  Sport: '#FF0000', // Red
  Work: '#00FF00',  // Green
  Study: '#0000FF', // Blue
  Family: '#FFFF00', // Yellow
};

export default function HomeScreen() {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType | Dayjs>(dayjs());
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });
  const [assignmentTypeSelected, setAssignmenTypeSelected] = useState('');
  const [time, setTime] = useState(new Date());
  const [timeArray, setTimeArray] = useState<string[]>(['1', '2', '0', '0']);
  const [displayTime, setDisplayTime] = useState('');

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: time,
      mode: 'time',
      display: 'spinner',
      is24Hour: true,
      minuteInterval: 10,
      onChange: (event, selectedTime) => {
        if (event.type === 'set') {
          const currentTime = selectedTime || time;
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
  ];

  const convertToDate = (date: DateType | Dayjs): Date => {
    if (!date) throw new Error('Invalid date');
    return dayjs.isDayjs(date) ? date.toDate() : new Date(date);
  };

  const handleAddAssignment = () => {
    if (!selected || !newAssignment.title.trim()) return;
    if (displayTime === '') {
      const currentTime = time;
      setTime(currentTime);
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      setDisplayTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
    }
    const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
    const updated = {
      ...assignments,
      [dateKey]: [
        ...(assignments[dateKey] || []),
        {
          ...newAssignment,
          date: dateKey,
          time: displayTime,
          type: assignmentTypeSelected,
        },
      ],
    };
    setAssignments(updated);
    setNewAssignment({ title: '', description: '' });
    setAssignmenTypeSelected('');
    setTime(new Date());
    setTimeArray(['1', '2', '0', '0']);
    setDisplayTime('');
    setIsModalVisible(false);
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
    const updated = {
      ...assignments,
      [dateKey]: (assignments[dateKey] || []).filter((a) => a !== assignment),
    };
    setAssignments(updated);
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
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: Dimensions.get('window').height,
        }}
      >
        <View style={{ width: width * 0.9 }}>
          <DateTimePicker
            mode="single"
            date={selected}
            onChange={({ date }) => setSelected(date)}
            weekdaysHeight={50}
            showOutsideDays={true}
            firstDayOfWeek={1}
            navigationPosition="right"
            style={{ backgroundColor: '#D1FAE5', padding: 16, borderRadius: 24, marginTop: 32 }}
            styles={{
              ...defaultStyles,
              month_selector_label: { fontSize: 24, fontWeight: 'bold', marginLeft: 8 },
              year_selector_label: { fontSize: 24, fontWeight: 'bold', marginRight: 8 },
              button_next: {
                borderRadius: 8,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#D1FAE5',
              },
              button_prev: {
                borderRadius: 8,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#D1FAE5',
              },
              weekdays: { borderBottomWidth: 2, borderBottomColor: '#000000' },
              weekday_label: { fontWeight: 'bold' },
              today: { borderColor: '#F59E0B', borderWidth: 1 },
              selected: { borderColor: '#34D399', borderWidth: 4, borderRadius: 999 },
              selected_label: { color: '#000000', fontWeight: 'bold' },
              // Dynamic day style function cast to any so that a plain style object is provided
              day: ((date: DateType | Dayjs): ViewStyle => {
                const safeDefault: any = defaultStyles.day ?? {};
                if (safeDefault.cursor) {
                  delete safeDefault.cursor;
                }
                return { ...safeDefault, ...customDayStyle(date) };
              }) as any,
              disabled: { opacity: 0.5 },
              outside: { opacity: 0.5 },
            }}
          />

          {selected && (
            <View
              style={{
                marginTop: 32,
                padding: 16,
                borderWidth: 1,
                borderStyle: 'dotted',
                borderColor: 'gray',
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Assignments for {format(convertToDate(selected), 'MMM dd, yyyy')}
                </Text>
                <Button onPress={() => setIsModalVisible(true)}>
                  <ButtonIcon
                    as={AddIcon}
                    size="md"
                    style={{ width: 24, height: 24, color: 'black' }}
                  />
                </Button>
              </View>

              {sortedAssignments.length === 0 ? (
                <Text style={{ color: 'gray' }}>No assignments for this day</Text>
              ) : (
                <View>
                  {sortedAssignments.map((assignment, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 12 }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 8,
                          backgroundColor: 'gray',
                          width: 60,
                          height: 60,
                        }}
                      >
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                          {assignment.time}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor:
                            RadioColors[assignment.type as keyof typeof RadioColors] ||
                            '#CCCCCC',
                          marginLeft: 8,
                        }}
                      >
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                              {assignment.title}
                            </Text>
                            <Text style={{ fontSize: 14, color: 'gray' }}>
                              {assignment.description}
                            </Text>
                          </View>
                          <View>
                            <Button onPress={() => handleDeleteAssignment(assignment)}>
                              <ButtonIcon
                                as={TrashIcon}
                                size="md"
                                style={{ width: 24, height: 24, color: 'black' }}
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
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 24,
                borderRadius: 16,
                width: 320,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                New Assignment
              </Text>
              <RadioButton data={RadioData} onSelect={setAssignmenTypeSelected} value={assignmentTypeSelected} />
              <TextInput
                placeholder="Title *"
                value={newAssignment.title}
                onChangeText={(text) =>
                  setNewAssignment((prev) => ({ ...prev, title: text }))
                }
                style={{
                  marginBottom: 16,
                  padding: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  minWidth: 160,
                }}
              />
              <TextInput
                placeholder="Description"
                value={newAssignment.description}
                onChangeText={(text) =>
                  setNewAssignment((prev) => ({ ...prev, description: text }))
                }
                style={{
                  marginBottom: 24,
                  padding: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  minWidth: 160,
                }}
                multiline
              />
              <Pressable onPress={showTimePicker}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <HourBox value={timeArray[0]} />
                  <HourBox value={timeArray[1]} />
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>:</Text>
                  <HourBox value={timeArray[2]} />
                  <HourBox value={timeArray[3]} />
                </View>
              </Pressable>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                <Button variant="outline" onPress={() => setIsModalVisible(false)}>
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button onPress={handleAddAssignment}>
                  <ButtonText>Save</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
