import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const LoginScreen = () => {
  return (
    <View className='justify-center content-center w-full h-full'>
      <Link href="/(auth)/register">Register</Link>
    </View>
  )
}

export default LoginScreen