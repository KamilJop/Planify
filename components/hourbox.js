import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

export default function HourBox({ value }) {
  return (
    <View className='w-10 h-12 bg-gray-100 items-center justify-center border-2 border-gray-300 rounded-lg'>
        <Text className='font-bold'>{value}</Text>
    </View>
  );
}