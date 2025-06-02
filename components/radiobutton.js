import React from 'react';
import { View, Text, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const icons = {
  Sport: { iconSet: AntDesign, name: 'dribbble', color: '#FF5733' },
  Work: { iconSet: MaterialIcons, name: 'work', color: '#33FF57' },
  Study: { iconSet: FontAwesome, name: 'book', color: '#3357FF' },
  Family: { iconSet: AntDesign, name: 'home', color: '#FF33A1' },
  Travel: { iconSet: MaterialIcons, name: 'flight-takeoff', color: '#FF8C33' },
  Relax: { iconSet: FontAwesome, name: 'bed', color: '#33FFF5' },
  Social: { iconSet: AntDesign, name: 'team', color: '#F533FF' },
  Hobby: { iconSet: MaterialIcons, name: 'palette', color: '#FFC733' },
};

export default function RadioButton({ data, onSelect, value }) {
  return (
    <View>
      <View className="flex-row gap-5 justify-center items-center">
        {data.map((item, index) => {
          const isSelected = item.value === value;
          const Icon = icons[item.value].iconSet;
          const iconName = icons[item.value].name;
          const color = isSelected ? icons[item.value].color : '#888';
          const iconSize = isSelected ? 32 : 24;

          return (
            <Pressable key={index} onPress={() => onSelect(item.value)}>
              <View className="items-center justify-center px-2">
                <Icon name={iconName} size={iconSize} color={color} />
                <Text className="text-sm mt-1" style={{ color }}>{item.value}</Text>
              </View>
            </Pressable>  
            
          );
        })}
      </View>
    </View>
  );
}
