import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lottie from "lottie-react-native";
import { Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('window');
const Colors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#BB86FC',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  error: '#CF6679',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onPrimary: '#000000',
  onSecondary: '#000000',
  onError: '#000000',
};
const index = () => {
  return (
    <SafeAreaView className='justify-center content-center w-full h-full'>
      <Onboarding
      containerStyles={{ paddingHorizontal: 20 }}
      skipToPage={4}
      showDone={false}
      DotComponent={({ selected }) => (
           
        <View
        style={{
          width: selected ? 8 : 5,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 3,
          backgroundColor: selected ? Colors.primary : Colors.onSurface,
        }}
        />


      )}
      pages={[
        {
        backgroundColor: Colors.primary,
        image: (
          <View>
          <Lottie source={require('@/assets/animations/OnboardingAnimation1.json')} style={styles.lottie} autoPlay loop />
          </View>
        ),
        title: 'Welcome to Planify!',
        subtitle: 'Your personal hub for organizing daily events',
        },
        {
        backgroundColor: Colors.surface,
        image: (
          <View>
          <Lottie source={require('@/assets/animations/OnboardingAnimation5.json')} style={styles.lottie} autoPlay loop />
          </View>
        ),
        title: 'Manage Your Schedule',
        subtitle: 'Effortlessly add, edit, and remove events on a dynamic calendar',
        },
        {
        backgroundColor: Colors.primaryVariant,
        image: (
          <View>
          <Lottie source={require('@/assets/animations/OnboardingAnimation3.json')} style={styles.lottie} autoPlay loop />
          </View>
        ),
        title: 'Stay Notified',
        subtitle: 'Receive timely reminders so you never miss an important event',
        },
        {
        backgroundColor: Colors.secondary,
        image: (
          <View>
          <Lottie source={require('@/assets/animations/OnboardingAnimation4.json')} style={styles.lottie} autoPlay loop />
          </View>
        ),
        title: 'Insights & Summaries',
        subtitle: 'Review interactive charts to see your productivity over weeks, months, and years',
        },
        {
        backgroundColor: Colors.primary,
        image: (
          <Animatable.View
         animation="pulse"
            duration={2000}
            iterationCount="infinite"
        > 
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
             
          <Link
            href="/(tabs)"
            style={{
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 8,
            marginTop: 32,
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 16, borderRadius: 180, height: 200, width: 200 }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 32 }}>Start your adventure!</Text>
            </View>
          </Link>
          </View>
          </Animatable.View>
        ),
        title: 'Get Started!',
        subtitle: 'Sign up now to start planning your day with Planify',
        }
      ]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  lottie: {
    width: width*0.9,
    height: width,
  },
})

export default index