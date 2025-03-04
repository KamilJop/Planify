import { Link } from 'expo-router';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';


export default function HomeScreen() {
  return (
    <View className='justify-center content-center w-full h-full'>
      <Text >Home</Text>
      <Link href="/(auth)/register">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
