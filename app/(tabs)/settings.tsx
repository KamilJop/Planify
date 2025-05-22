import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/components/ThemeContext'
import { Divider } from "@/components/ui/divider"
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Picker } from '@react-native-picker/picker'

const Settings = () => {
  const { theme, toggleTheme, colors, accent, setAccent } = useTheme()
  const [notifications, setNotifications] = React.useState(true)
  const [notificationTime, setNotificationTime] = React.useState(15)
  const width = Dimensions.get('window').width * 0.9

  return (
    <View style={{
      flex: 1, 
      backgroundColor: colors.background, 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>

      {/* Theme and accent color */}
      <VStack style={{ width: width, height: 100, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}>
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}>
            Theme
          </Text>
          <TouchableOpacity onPress={toggleTheme}>
            <Text style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </TouchableOpacity>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' }} />
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={{ color: colors.textColor, marginHorizontal: 10, fontSize: 15 }}>
            Accent Color
          </Text>
          <HStack style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
            {['#a258d6', '#7c4cd1', '#3497b1', '#299876', '#c43540'].map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setAccent(color)}
                style={{
                  backgroundColor: color,
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: color === accent ? colors.onBackground : color,
                }}
              />
            ))}
          </HStack>
        </HStack>
      </VStack>

      {/* Change username and profile picture */}
      <VStack style={{ width: width, height: 120, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, padding: 5, margin: 10 }}>
        <HStack style={{ width: width, alignItems: 'center', padding: 10 }}>
          <View style={{ backgroundColor: 'gray', borderColor: 'gray', borderRadius: 100, borderWidth: 1, height: 50, width: 50, marginLeft: 5, marginTop: 5 }} />
          <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
        Change Username
          </Text>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' , marginBottom:10}} />
        <HStack style={{ width: width, alignItems: 'center', paddingLeft: 15 }}>
          <Text style={{ color: colors.textColor, fontSize: 15, marginLeft: 5 }}>
        Change Profile Picture
          </Text>
        </HStack>
      </VStack>


      {/* Notifications */}


      <VStack style={{ width: width, height: 130, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}>
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>

      <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
          Notifications
      </Text>
      <HStack style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
      <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 10, fontSize: 15 }}>
          {notifications ? 'On' : 'Off'}
      </Text>
       <Switch
          style={{ }}
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
        <HStack style={{ flexDirection: 'row', alignItems: 'center', gap : 10, marginRight: 10 }}>
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
      </VStack>

      <TouchableOpacity style={{ width: width, height: 40,justifyContent : 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}
        onPress={() => console.log('Language Picker Pressed')}>
        <Text style={{ color: colors.textColor, marginRight: 10, marginLeft: 20, fontSize: 15 }}>
          Reset App to Default
        </Text>
      </TouchableOpacity>
  
    </View>
  )
}

export default Settings