import React from 'react';
import { View, Text, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const icons = {
  Sport: {
    iconSet: AntDesign,
    name: 'dribbble',
    color: 'red',
  },
  Work: {
    iconSet: MaterialIcons,
    name: 'work',
    color: 'green',
  },
  Study: {
    iconSet: FontAwesome,
    name: 'book',
    color: 'blue',
  },
  Family: {
    iconSet: AntDesign,
    name: 'home',
    color: 'orange',
  },
  Travel: {
    iconSet: MaterialIcons,
    name: 'flight-takeoff',
    color: 'purple',
  },
  Relax: {
    iconSet: FontAwesome,
    name: 'bed',
    color: 'pink',
  },
  Social: {
    iconSet: AntDesign,
    name: 'team',
    color: 'yellow',
  },
  Hobby: {
    iconSet: MaterialIcons,
    name: 'palette',
    color: 'cyan',
  },
};

export default function RadioButton({ data, onSelect, value }) {
  return (
    <View>
      <View className="flex-row gap-5 justify-center items-center">
        {data.map((item, index) => {
          const isSelected = item.value === value;
          const Icon = icons[item.value].iconSet;
          const iconName = icons[item.value].name;
          const iconColor = isSelected ? icons[item.value].color : '#888';
          const iconSize = isSelected ? 32 : 24;

          return (
            <Pressable key={index} onPress={() => onSelect(item.value)}>
              <View className="items-center justify-center px-2">
                <Icon name={iconName} size={iconSize} color={iconColor} />
                <Text className="text-sm mt-1 text-white">{item.value}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
