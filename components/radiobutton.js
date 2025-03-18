import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

const icons = {
  Sport: {
    selected: require('@/assets/icons/settings.png'),
    unselected: require('@/assets/icons/calendar.png'),
  },
  Work: {
    selected: require('@/assets/icons/settings.png'),
    unselected: require('@/assets/icons/calendar.png'),
  },
  Study: {
    selected: require('@/assets/icons/settings.png'),
    unselected: require('@/assets/icons/calendar.png'),
  },
  Family: {
    selected: require('@/assets/icons/settings.png'),
    unselected: require('@/assets/icons/calendar.png'),
  },
};

export default function RadioButton({ data, onSelect, value }) {
  return (
    <View>
      <View className="flex-row gap-5">
        {data.map((item, index) => {
          const isSelected = item.value === value;
          return (
            <View key={index} className="items-center justify-center">
              <Pressable onPress={() => onSelect(item.value)}>
                <Image 
                  source={isSelected ? icons[item.value].selected : icons[item.value].unselected} 
                  className="w-10" 
                  style={{ height: isSelected ? 30 : 20, width: isSelected ? 30 : 20 }}
                />
                <Text className="text-lg mt-2">{item.value}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
      
    </View>
  );
}