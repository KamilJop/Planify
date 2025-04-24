import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { BellIcon, CloseCircleIcon, Icon, RemoveIcon, TrashIcon } from '@/components/ui/icon';
import { ChevronDownIcon } from "@/components/ui/icon"
const Settings = () => {

  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const width = Dimensions.get('window').width * 0.9;
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
  return (
    <View style={{flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: width, justifyContent: 'space-between', borderColor: Colors.primary, borderWidth: 1, borderRadius: 10, padding: 5, margin : 10, height: 50}}>
      <Text style={{color: theme === 'dark' ? Colors.primary : 'white', marginRight: 10, marginLeft:10}}>Light Mode</Text>
      <Switch
        size='lg'
        value={theme === 'dark'}
        onValueChange={() => {setTheme(theme === 'dark' ? 'light' : 'dark')}}
        trackColor={{ false: Colors.onSurface, true: Colors.primary }}
        thumbColor={Colors.onBackground}
        ios_backgroundColor={Colors.onSurface}/>
      <Text style={{color: theme === 'dark' ? Colors.primary : 'white', marginLeft: 10, marginRight : 10}}>Dark Mode</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', width: width, justifyContent: 'space-between', borderColor: Colors.primary, borderWidth: 1, borderRadius: 10, padding: 5, margin : 10, height: 50}}>
      <Text style={{color: theme === 'dark' ? Colors.primary : 'white', marginRight: 10, marginLeft : 10}}>Notifications</Text>
      <Switch
       style={{marginRight: 50}}
        size='lg'
        value={notifications}
        onValueChange={() => {setNotifications(!notifications)}}
        trackColor={{ false: Colors.onSurface, true: Colors.primary }}
        thumbColor={Colors.onBackground}
        ios_backgroundColor={Colors.onSurface}/>  
        <View style={{flexDirection: 'row', alignItems: 'center'}}>  
      <Text style={{color: theme === 'dark' ? Colors.primary : 'white', marginRight: 10}}>{notifications ? 'On' : 'Off'}</Text>
      <Icon as={notifications ?  BellIcon : CloseCircleIcon } size='lg' color={theme === 'dark' ? Colors.primary : 'white'} ></Icon>
      </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', width: width, justifyContent: 'space-between', borderColor: Colors.primary, borderWidth: 1, borderRadius: 10, padding: 5, margin : 10, height: 50}}>
      <Text style={{color: theme === 'dark' ? Colors.primary : 'white', marginRight: 10, marginLeft : 10}}>Language</Text>

      </View>

    </View>
  )
}

export default Settings