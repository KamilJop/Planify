import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Lottie from "lottie-react-native";
import { Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import LoginScreen from './(auth)/login';
const {width, height} = Dimensions.get('window');

const index = () => {
  return (
    <SafeAreaView className='justify-center content-center w-full h-full'>
      <Onboarding containerStyles={{paddingHorizontal: 20}}
        skipToPage={4}
        showDone={false}
        DotComponent={({selected}) => (
            <View
                style={{
                    width: selected ? 8 : 5,
                    height: 5,
                    borderRadius: 5,
                    marginHorizontal: 3,
                    backgroundColor: selected ? '#000' : '#ccc',
                }}
            />
        )}
        pages={[
            {
            backgroundColor: '#a7f2b7',
            image: (<View>
                <Lottie source={require('@/assets/animations/OnboardingAnimation1.json')} style={styles.lottie} autoPlay loop />
            </View>),
            title: 'Welcome to Planify!',
            subtitle: 'Your personal hub for organizing daily events',
            },
            {
                backgroundColor: '#71d8eb',
                image: (<View><Lottie source={require('@/assets/animations/OnboardingAnimation5.json')} style={styles.lottie} autoPlay loop /></View>),
                title: 'Manage Your Schedule',
                subtitle: 'Effortlessly add, edit, and remove events on a dynamic calendar',
            },
            {
                backgroundColor: '#c179fc',
                image: (<View><Lottie source={require('@/assets/animations/OnboardingAnimation3.json')} style={styles.lottie} autoPlay loop /></View>),
                title: 'Stay Notified',
                subtitle: 'Receive timely reminders so you never miss an important event',
            },
            {
                backgroundColor: '#ffc34a',
                image: (<View><Lottie source={require('@/assets/animations/OnboardingAnimation4.json')} style={styles.lottie} autoPlay loop /></View>),
                title: 'Insights & Summaries',
                subtitle: 'Review interactive charts to see your productivity over weeks, months, and years',
            },
            {
                backgroundColor: '#ff6b6b',
                image: (<LoginScreen />),
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