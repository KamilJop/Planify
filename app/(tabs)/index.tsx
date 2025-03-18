import { useState } from 'react';
import { View, Text, Dimensions, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
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
  const defaultClassNames = useDefaultClassNames();
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
    if (displayTime === ''){
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

  // Sort assignments by time
  const sortedAssignments = selectedDateAssignments.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''), 10); // Convert "09:00" to 900
    const timeB = parseInt(b.time.replace(':', ''), 10); // Convert "10:00" to 1000
    return timeA - timeB; // Sort in ascending order
  });

  return (
    <ScrollView>
      <View className="justify-center items-center w-full h-full" style={{ minHeight: Dimensions.get('window').height }}>
        <View style={{ width: width * 0.9 }}>
          <DateTimePicker
            mode="single"
            date={selected}
            onChange={({ date }) => setSelected(date)}
            weekdaysHeight={50}
            showOutsideDays={true}
            firstDayOfWeek={1}
            navigationPosition="right"
            className="bg-green-200 p-4 rounded-3xl mt-8"
            classNames={{
              ...defaultClassNames,
              day_cell: '',
              month_selector_label: 'text-3xl font-bold ml-2',
              year_selector_label: 'text-3xl font-bold mr-2',
              button_next: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
              button_prev: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
              weekdays: 'border-black-100 border-b-2',
              weekday_label: 'font-bold',
              today: 'border-amber-500',
              selected: 'border-green-400 border-4 rounded-full',
              selected_label: 'text-black font-bold',
              day: `${defaultClassNames.day} hover:bg-amber-100`,
              disabled: 'opacity-50',
              outside: 'opacity-50',
            }}
          />

          {selected && (
            <View className="mt-8 p-4 border-dotted border-2 border-gray-500 rounded-lg">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-bold text-lg">
                  Assignments for {format(convertToDate(selected), 'MMM dd, yyyy')}
                </Text>
                <Button onPress={() => setIsModalVisible(true)}>
                  <ButtonIcon as={AddIcon} size="md" className="w-6 h-6 text-black font-bold" />
                </Button>
              </View>

              {sortedAssignments.length === 0 ? (
                <Text className="text-gray-500">No assignments for this day</Text>
              ) : (
                <View>
                  {sortedAssignments.map((assignment, index) => (
                    <View key={index} className="flex-row gap-4 mb-3">
                      <View
                        className="items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'gray', width: 60, height: 60 }}
                      >
                        <Text className="font-bold text-white">{assignment.time}</Text>
                      </View>
                      <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: RadioColors[assignment.type as keyof typeof RadioColors] || '#CCCCCC' }}>
                        <View className='flex-row'>
                          <View className='flex-1'>
                            <Text className="font-bold text-base">{assignment.title}</Text>
                            <Text className="text-sm text-gray-600">{assignment.description}</Text>
                          </View>
                          <View>
                            <Button onPress={() => handleDeleteAssignment(assignment)}>
                              <ButtonIcon as={TrashIcon} size="md" className="w-6 h-6 text-black font-bold"/>
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
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-2xl w-80 items-center justify-center">
              <Text className="text-xl font-bold mb-4">New Assignment</Text>
              <RadioButton data={RadioData} onSelect={setAssignmenTypeSelected} value={assignmentTypeSelected} />
              <TextInput
                placeholder="Title *"
                value={newAssignment.title}
                onChangeText={(text) => setNewAssignment((p) => ({ ...p, title: text }))}
                className="mb-4 p-2 border-b-2 border-gray-200 min-w-40"
              />
              <TextInput
                placeholder="Description"
                value={newAssignment.description}
                onChangeText={(text) => setNewAssignment((p) => ({ ...p, description: text }))}
                className="mb-6 p-2 border-b-2 border-gray-200 min-w-40"
                multiline
              />
              <Pressable onPress={() => showTimePicker()}>
                <View className="flex-row items-center justify-center mb-4 gap-1">
                  <HourBox value={timeArray[0]} />
                  <HourBox value={timeArray[1]} />
                  <Text className="text-xl font-bold">:</Text>
                  <HourBox value={timeArray[2]} />
                  <HourBox value={timeArray[3]} />
                </View>
              </Pressable>

              <View className="flex-row justify-end gap-4">
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