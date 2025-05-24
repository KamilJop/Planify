import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { View, Text, Dimensions, TouchableOpacity, Pressable, Image, Alert } from 'react-native';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/ThemeContext';
import { Divider } from "@/components/ui/divider";
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Modal as NativeModal } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { useFocusEffect } from '@react-navigation/native';
import { Icon, CloseIcon } from "@/components/ui/icon";

// Import your face images
const image1 = require('@/assets/faces/uifaces-popular-image1.jpg');
const image2 = require('@/assets/faces/uifaces-popular-image2.jpg');
const image3 = require('@/assets/faces/uifaces-popular-image3.jpg');
const image4 = require('@/assets/faces/uifaces-popular-image4.jpg');
const image5 = require('@/assets/faces/uifaces-popular-image5.jpg');
const image6 = require('@/assets/faces/uifaces-popular-image6.jpg');
const image7 = require('@/assets/faces/uifaces-popular-image7.jpg');
const image8 = require('@/assets/faces/uifaces-popular-image8.jpg');

const Settings = () => {
  const { theme, toggleTheme, colors, accent, setAccent } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [notificationTime, setNotificationTime] = React.useState(15);
  const [showModal, setShowModal] = React.useState(false);
  const [showFacesModal, setShowFacesModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(image1);
  const [animationKey, setAnimationKey] = React.useState(0);

  const width = Dimensions.get('window').width * 0.9;

  // Load saved profile image
  React.useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const idx = await AsyncStorage.getItem('profileImage');
        if (idx !== null) {
          const images = [image1, image2, image3, image4, image5, image6, image7, image8];
          const index = parseInt(idx, 10);
          if (!isNaN(index) && images[index]) {
            setSelectedImage(images[index]);
          }
        }
      } catch (e) {
        console.error("Failed to load profile image:", e);
      }
    };
    loadProfileImage();
  }, []);
   
   useFocusEffect(
    React.useCallback(() => {
      setAnimationKey(prevKey => prevKey + 1);
      return () => {};
    }, [])
  );
  // Handle theme toggle with toast
  const handleThemeToggle = () => {
    toggleTheme();
    Toast.show({
      type: 'success',
      text1: `Theme changed to ${theme === 'dark' ? 'Light' : 'Dark'}!`,
      position: 'bottom',
    });
  };

  // Handle accent color change with toast
  const handleAccentChange = (color: string) => {
    setAccent(color);
    Toast.show({
      type: 'info',
      text1: 'Accent color changed!',
      position: 'bottom',
    });
  };

  // Handle app reset with toast
  const handleReset = async () => {
    try {
      await AsyncStorage.clear();
      setAccent('#a258d6');
      setNotifications(true);
      setNotificationTime(15);
      if (theme === 'dark') toggleTheme();
      
      Toast.show({
        type: 'success',
        text1: 'App reset to default!',
        position: 'bottom',
      });
      setShowModal(false);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Failed to reset!',
        position: 'bottom',
      });
      console.error("Failed to reset:", e);
    }
  };

  // Handle profile image change
  const handleImageChange = async (img: any, idx: number) => {
    setSelectedImage(img);
    try {
      await AsyncStorage.setItem('profileImage', idx.toString());
      Toast.show({
        type: 'success',
        text1: 'Profile picture updated!',
        position: 'bottom',
      });
      setShowFacesModal(false);
    } catch (e) {
      console.error("Failed to save profile image:", e);
    }
  };

  return (
    <Animatable.View 
      animation="fadeInUp" 
      key={animationKey}
      duration={700} 
      style={{
        flex: 1, 
        backgroundColor: colors.background, 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      {/* Theme and accent color */}
      <Animatable.View 
        animation="bounceIn" 
        key={animationKey}
        delay={100} 
        style={{ width: width, height: 100, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}
      >
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}>
            Theme
          </Text>
          <TouchableOpacity onPress={handleThemeToggle}>
            <Animatable.Text 

              animation="pulse" 
              iterationCount="infinite" 
              style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}
            >
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Animatable.Text>
          </TouchableOpacity>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' }} />
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}>
            Accent Color
          </Text>
          <HStack style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
            {['#a258d6', '#7c4cd1', '#3497b1', '#299876', '#c43540'].map((color) => (
              <Animatable.View 

                animation="bounceIn" 
                delay={200} 
                key={color}
              >
                <TouchableOpacity
                  onPress={() => handleAccentChange(color)}
                  style={{
                    backgroundColor: color,
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: color === accent ? colors.onBackground : color,
                  }}
                />
              </Animatable.View>
            ))}
          </HStack>
        </HStack>
      </Animatable.View>

      {/* Change username and profile picture */}
      <Animatable.View 
        animation="bounceIn" 
        key={animationKey}
        delay={200} 
        style={{ width: width, height: 120, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, padding: 5, margin: 10 }}
      >
        <HStack style={{ width: width, alignItems: 'center', padding: 10 }}>
          <Animatable.View animation="rubberBand" duration={1500}>

            <View style={{ backgroundColor: 'gray', borderColor: 'gray', borderRadius: 100, borderWidth: 1, height: 50, width: 50, marginLeft: 5, marginTop: 5 }}>
              <Image
                source={selectedImage}
                style={{ width: 50, height: 50, borderRadius: 100 }}
              />
            </View>
          </Animatable.View>
          <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
            Change Username
          </Text>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%', marginBottom: 10 }} />
        <HStack style={{ width: width, alignItems: 'center', paddingLeft: 15 }}>
          <TouchableOpacity onPress={() => setShowFacesModal(true)}>
            <Animatable.Text 
              animation="fadeIn" 
              style={{ color: colors.textColor, fontSize: 15, marginLeft: 5 }}
            >
              Change Profile Picture
            </Animatable.Text>
          </TouchableOpacity>
        </HStack>
      </Animatable.View>

      {/* Notifications */}
      <Animatable.View 
        animation="bounceIn" 
        key={animationKey}
        delay={300} 
        style={{ width: width, height: 130, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}
      >
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
            Notifications
          </Text>
          <HStack style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
              {notifications ? 'On' : 'Off'}
            </Text>
            <Switch
              style={{}}
              size='sm'
              value={notifications}
              onValueChange={() => setNotifications(!notifications)}
              trackColor={{ false: colors.onSurface, true: accent }}
              thumbColor={colors.onBackground}
              ios_backgroundColor={colors.onSurface}
            />  
          </HStack>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' }} />
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
            Reminder Time
          </Text>
          <HStack style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
            <View style={{
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: 140, 
              height: 30, 
              borderColor: colors.onSurface, 
              borderWidth: 1, 
              borderRadius: 10, 
              padding: 5
            }}>
              <Picker
                style={{
                  width: 140, 
                  height: 60, 
                  color: colors.textColor
                }}
                dropdownIconColor={accent}
                mode="dropdown"
                selectedValue={notificationTime}
                onValueChange={(itemValue) => setNotificationTime(Number(itemValue))}
              >
                <Picker.Item label="15 min" value="15" />
                <Picker.Item label="30 min" value="30" />
                <Picker.Item label="1 hour" value="60" />
                <Picker.Item label="2 hours" value="120" />
                <Picker.Item label="6 hours" value="360" />
              </Picker>
            </View>
          </HStack>
        </HStack>
      </Animatable.View>

      {/* Reset button */}
      <Animatable.View 

        animation="bounceIn" 
        delay={400}
      >
        <TouchableOpacity 
          style={{ 
            width: width, 
            height: 40,
            justifyContent: 'center', 
            backgroundColor: colors.surface, 
            borderRadius: 10, 
            margin: 10 
          }}
          onPress={() => setShowModal(true)}
        >
          <Animatable.Text 
            animation="rubberBand" 
            style={{ 
              color: colors.textColor, 
              marginRight: 10, 
              marginLeft: 20, 
              fontSize: 15 
            }}
          >
            Reset App to Default
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Reset Confirmation Modal */}
      <NativeModal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <Center style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Animatable.View 

            animation="fadeInUp"
            style={{ width: width, height: 200, backgroundColor: colors.surface, borderRadius: 10, padding: 20 }}
          >
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading style={{ color: colors.textColor }}>Reset App</Heading>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon as={CloseIcon} size={'md'} color={colors.textColor} />
              </TouchableOpacity>
            </HStack>
            <Text style={{ color: colors.textColor, marginTop: 10 }}>
              Are you sure you want to reset the app to default settings?
            </Text>
            <Button
              onPress={handleReset}
              style={{
                backgroundColor: accent,
                marginTop: 20,
                width: '100%',
                height: 40,
                justifyContent: 'center',
                borderRadius: 10,
              }}
            >
              <ButtonText style={{ color: colors.onBackground }}>Reset</ButtonText>
            </Button>
          </Animatable.View>
        </Center>
      </NativeModal>

      {/* Profile Picture Selection Modal */}
      <NativeModal
        animationType="slide"
        transparent={true}
        visible={showFacesModal}
        onRequestClose={() => setShowFacesModal(false)}
      >
        <Center style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Animatable.View 
          
            animation="fadeInUp"
            style={{ width: width, height: 300, backgroundColor: colors.surface, borderRadius: 10, padding: 20 }}
          >
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading style={{ color: colors.textColor }}>Change Profile Picture</Heading>
              <TouchableOpacity onPress={() => setShowFacesModal(false)}>
                <Icon as={CloseIcon} size={'md'} color={colors.textColor} />
              </TouchableOpacity>
            </HStack>
            <Text style={{ color: colors.textColor, marginTop: 10 }}>
              Select a new profile picture from the available options.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
              {[image1, image2, image3, image4, image5, image6, image7, image8].map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleImageChange(img, idx)}
                  style={{
                    margin: 10,
                    borderWidth: selectedImage === img ? 2 : 0,
                    borderColor: accent,
                    borderRadius: 25,
                  }}
                >
                  <Image source={img} style={{ width: 50, height: 50, borderRadius: 25 }} />
                </Pressable>
              ))}
            </View>
          </Animatable.View>
        </Center>
      </NativeModal>

      <Toast />
    </Animatable.View>
  );
};

export default Settings;