import { Time } from '@expo/html-elements';
import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import Calender from '@/components/calender';
export default function HomeScreen() {
  return (
    <View className='justify-center content-center w-full h-full'>
      <Calender />

    </View>
  );
}


