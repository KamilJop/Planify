import { View, Text, FlatList, Dimensions, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Button, ButtonIcon, ButtonText } from './ui/button';
import { AddIcon } from './ui/icon';

const { width } = Dimensions.get('window');

// MonthView Component
const MonthView = ({ month, year }: { month: number; year: number }) => {
  const today = new Date(); // Get today's date
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year; // Check if this is the current month
  const [selectedDay, setSelectedDay] = useState<Date | null>(isCurrentMonth ? today : null); // Initialize selectedDay with today's date if it's the current month
  const [assignments, setAssignments] = useState<{ [key: string]: string[] }>({}); // Store assignments for each day
  const [modalVisible, setModalVisible] = useState(false);
  const days = useMemo(() => {
    const startDate = new Date(year, month, 1); // First day of the month
    const endDate = new Date(year, month + 1, 0); // Last day of the month
    const daysArray = [];

    // Add padding days from the previous month
    const startDayOfWeek = startDate.getDay(); // Day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
    for (let i = 0; i < startDayOfWeek; i++) {
      const paddingDate = new Date(startDate);
      paddingDate.setDate(paddingDate.getDate() - (startDayOfWeek - i));
      daysArray.push(new Date(paddingDate));
    }

    // Add days of the current month
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      daysArray.push(new Date(date));
    }

    // Add padding days at the end of the month to fill the last row
    const endDayOfWeek = endDate.getDay(); // Day of the week for the last day of the month
    const paddingDaysNeeded = 6 - endDayOfWeek; // Calculate how many padding days are needed
    for (let i = 1; i <= paddingDaysNeeded; i++) {
      const paddingDate = new Date(endDate);
      paddingDate.setDate(paddingDate.getDate() + i);
      daysArray.push(new Date(paddingDate));
    }

    return daysArray;
  }, [month, year]);

  // Handle day selection (toggle selection)
  const handleDayPress = (date: Date) => {
    if (selectedDay?.toDateString() === date.toDateString()) {
      // If the clicked day is already selected, unselect it
      setSelectedDay(null);
    } else {
      // Otherwise, select the clicked day
      setSelectedDay(date);
    }
  };

  // Calculate day width to ensure 7 days fit in a row
  const dayWidth = (width - 32) / 8; // Subtract padding (16 on each side) and divide by 7

  return (
    <View>
      <View className="p-4 mx-4" style={{ width: width - 32 }}>
        {/* Month and Year Header */}
        <View className="items-center mt-8">
          <Text className="text-xl font-bold mb-4">
            {new Date(year, month).toLocaleString('default', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal Backdrop */}
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Modal Content */}
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Add Assignment</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-blue-500">Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Days of the Week Header */}
      <View className='p-2 m-4 borber-solid rounded-lg border-2 border-black items-center justify-center'>
        <View className="flex-row justify-between gap-1.5 h-14">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <View 
              key={index} 
              className="items-center justify-center"
              style={{ width: dayWidth }} // Match the size of day grid cells
            >
              <Text className="text-base font-medium">{day}</Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View className="flex-row flex-wrap justify-between">
          {days.map((date, index) => {
            const isCurrentMonthDay = date.getMonth() === month; // Check if the date belongs to the current month
            const isSelected = selectedDay?.toDateString() === date.toDateString(); // Check if the date is selected

            return (
              <TouchableOpacity
                key={index}
                onPress={() => isCurrentMonthDay && handleDayPress(date)} // Handle day press only for current month days
                style={{ width: dayWidth }} // Set fixed width for each day
              >
                <View 
                  className={`h-14 m-0.5 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-blue-500' : isCurrentMonthDay ? 'bg-gray-100 border-solid border-2 border-gray-500' : 'bg-transparent' 
                  }`}
                >
                  {/* Day Number */}
                  <Text className={`text-base ${isSelected ? 'text-white' : isCurrentMonthDay ? 'text-black' : 'text-gray-400'}`}>
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Day Assignments */}
      {selectedDay && (
        <View className="m-4 p-4 border-dotted border-2 border-gray-500 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold mb-2">
              {`${selectedDay.getDate()}${['th', 'st', 'nd', 'rd'][((selectedDay.getDate() % 100) - 20) % 10] || 'th'} ${selectedDay.toLocaleString('default', { month: 'long' })} ${selectedDay.getFullYear()}`}
            </Text>
            <Button onPress={() => setModalVisible(true)}>
              <ButtonIcon as={AddIcon} size='md' className='w-6 h-6 text-black font-bold'></ButtonIcon>
            </Button>
          </View>
          <View>
            {assignments[selectedDay.toDateString()]?.map((assignment, index) => (
              <Text key={index} className="text-base">{assignment}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Calendar Component
const Calendar = () => {
  const months = useMemo(() => {
    const startDate = new Date(); // Start from the current date
    return Array.from({ length: 12 }, (_, i) => {
      const month = (startDate.getMonth() + i) % 12; // Wrap around after December
      const year = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12); // Increment year after December
      return { month, year };
    });
  }, []);

  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={months}
      keyExtractor={(item) => `${item.year}-${item.month}`}
      renderItem={({ item }) => (
        <View style={{ width }}>
          <MonthView month={item.month} year={item.year} />
        </View>
      )}
    />
  );
};

export default Calendar;