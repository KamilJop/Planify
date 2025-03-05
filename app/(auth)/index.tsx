import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const LoginScreen = () => {
  return (
    <View>
      <Link href="/(auth)/register">Register</Link>
    </View>
  )
}

export default LoginScreen