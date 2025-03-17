import { useState } from 'react';
import { View, Text, Dimensions, Modal, TextInput } from 'react-native';
import DateTimePicker, { useDefaultClassNames, DateType } from 'react-native-ui-datepicker';
import { Button, ButtonText } from '@/components/ui/button';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';

type Assignment = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
};

const width = Dimensions.get('window').width;

export default function HomeScreen() {
  const defaultClassNames = useDefaultClassNames();
  const [selected, setSelected] = useState<DateType | Dayjs>(dayjs());
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });

  const convertToDate = (date: DateType | Dayjs): Date => {
    return date instanceof Dayjs ? date.toDate() : new Date(date);
  };

  const handleAddAssignment = () => {
    if (!selected || !newAssignment.title.trim()) return;

    const dateKey = format(convertToDate(selected), 'yyyy-MM-dd');
    const updated = {
      ...assignments,
      [dateKey]: [...(assignments[dateKey] || []), { ...newAssignment, date: dateKey }]
    };

    setAssignments(updated);
    setNewAssignment({ title: '', description: '' });
    setIsModalVisible(false);
  };

  const selectedDateKey = selected ? format(convertToDate(selected), 'yyyy-MM-dd') : '';
  const selectedDateAssignments = assignments[selectedDateKey] || [];

  return (
    <View className='justify-center items-center w-full h-full'>
      <View style={{ width: width * 0.9 }}>
        <DateTimePicker
          mode="single"
          date={selected}
          onChange={({ date }) => setSelected(date)}
          weekdaysHeight={50}
          showOutsideDays={true}
          firstDayOfWeek={1}
          navigationPosition='right'
          className='bg-green-200 p-4 rounded-3xl'
          classNames={{
            ...defaultClassNames,
            month_selector_label: 'text-3xl font-bold ml-2',
            year_selector_label: 'text-3xl font-bold mr-2',
            button_next: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
            button_prev: 'rounded-lg w-8 h-8 flex items-center justify-center bg-green-100',
            weekdays: 'border-black-100 border-b-2',
            weekday_label: 'font-bold',
            today: 'border-amber-500',
            selected: 'border-green-400 border-4 rounded-full',
            selected_label: "text-black font-bold",
            day: `${defaultClassNames.day} hover:bg-amber-100`,
            disabled: 'opacity-50',
            outside: 'opacity-50',
          }}
        />

        {selected && (
          <View className="m-4 p-4 border-dotted border-2 border-gray-500 rounded-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-lg">
                Assignments for {format(convertToDate(selected), 'MMM dd, yyyy')}
              </Text>
              <Button onPress={() => setIsModalVisible(true)}>
                <ButtonText>Add Assignment</ButtonText>
              </Button>
            </View>

            {selectedDateAssignments.length === 0 ? (
              <Text className="text-gray-500">No assignments for this day</Text>
            ) : (
              selectedDateAssignments.map((assignment, index) => (
                <View key={index} className="mb-3 p-3 bg-gray-100 rounded-lg">
                  <Text className="font-bold text-base">{assignment.title}</Text>
                  <Text className="text-sm text-gray-600">{assignment.description}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-80">
            <Text className="text-xl font-bold mb-4">New Assignment</Text>
            
            <TextInput
              placeholder="Title *"
              value={newAssignment.title}
              onChangeText={text => setNewAssignment(p => ({ ...p, title: text }))}
              className="mb-4 p-2 border-b-2 border-gray-200"
            />
            
            <TextInput
              placeholder="Description"
              value={newAssignment.description}
              onChangeText={text => setNewAssignment(p => ({ ...p, description: text }))}
              className="mb-6 p-2 border-b-2 border-gray-200"
              multiline
            />

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
  );
}