// app/(tabs)/settings.tsx
import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Switch } from '@/components/ui/switch'
import { BellIcon, CloseCircleIcon, Icon } from '@/components/ui/icon'
import { ChevronDownIcon } from "@/components/ui/icon"
import { Picker } from '@react-native-picker/picker'
import { useTheme } from '@/components/ThemeContext'
import { Divider } from "@/components/ui/divider"
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
const Settings = () => {
  const { theme, toggleTheme, colors } = useTheme()
  const [notifications, setNotifications] = React.useState(true)
  const [selectedLanguage, setSelectedLanguage] = React.useState('en')
  const width = Dimensions.get('window').width * 0.9

  return (
    <View style={{
      flex: 1, 
      backgroundColor: colors.background, 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>

      <VStack style={{ width: width, height: 80, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, margin: 10 }}>
        <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>

      <Text style={{ color: theme === 'dark' ? 'white' : 'black', marginRight: 10, marginLeft: 10, fontSize: 15 }}>
          Theme
      </Text>
      <Text style={{ color: theme === 'dark' ? 'white' : 'black', marginRight: 10, marginLeft: 10, fontSize: 15 }}>
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </Text>
         </HStack>
      <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' }} />

      <HStack style={{ width: width, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Text style={{ color: theme === 'dark' ? 'white' : 'black', marginRight: 10, marginLeft: 10, fontSize: 15 }}>
          Accent Color
        </Text>
        <HStack style={{ flexDirection: 'row', alignItems: 'center', gap : 10, marginRight: 10 }}>
          <View style={{backgroundColor:'#a258d6', width:20, height:20 , borderColor:'#a258d6', borderRadius:100, borderWidth:1 }}> </View>
          <View style={{backgroundColor:'#7c4cd1', width:20, height:20 , borderColor:'#7c4cd1', borderRadius:100, borderWidth:1 }}> </View>
          <View style={{backgroundColor:'#3497b1', width:20, height:20 , borderColor:'#3497b1', borderRadius:100, borderWidth:1 }}> </View>
          <View style={{backgroundColor:'#299876', width:20, height:20 , borderColor:'#299876', borderRadius:100, borderWidth:1 }}> </View>
          <View style={{backgroundColor:'red', width:20, height:20 , borderColor:'#c43540', borderRadius:100, borderWidth:1 }}> </View>
        </HStack>
        
      </HStack>
      </VStack>
      <VStack style={{ width: width, height: 120, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, padding: 5, margin: 10 }}>
        <HStack style={{ width: width, alignItems: 'center', padding: 10 }}>
          <View style={{ backgroundColor: 'gray', borderColor: 'gray', borderRadius: 100, borderWidth: 1, height: 50, width: 50, marginLeft: 5, marginTop: 5 }}> </View>
          <Text style={{ color: theme === 'dark' ? 'white' : 'black', marginRight: 10, marginLeft: 10, fontSize: 15 }}>
        Change Username
          </Text>
        </HStack>
        <Divider style={{ backgroundColor: 'gray', height: 1, width: '90%' , marginBottom:10}} />
        <HStack style={{ width: width, alignItems: 'center', paddingLeft: 15 }}>
          <Text style={{ color: theme === 'dark' ? 'white' : 'black', fontSize: 15, marginLeft: 5 }}>
        Change Profile Picture
          </Text>
        </HStack>
      </VStack>

  

      <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        width: width, 
        justifyContent: 'space-between', 
        borderColor: colors.primary, 
        borderWidth: 1, 
        borderRadius: 10, 
        padding: 5, 
        margin: 10, 
        height: 50
      }}>
        <Text style={{
          color: theme === 'dark' ? colors.primary : colors.onBackground, 
          marginRight: 10, 
          marginLeft: 10
        }}>
          Light Mode
        </Text>
        <Switch
          size='lg'
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.onSurface, true: colors.primary }}
          thumbColor={colors.onBackground}
          ios_backgroundColor={colors.onSurface}
        />
        <Text style={{
          color: theme === 'dark' ? colors.primary : colors.onBackground, 
          marginLeft: 10, 
          marginRight: 10
        }}>
          Dark Mode
        </Text>
      </View>


      <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        width: width, 
        justifyContent: 'space-between', 
        borderColor: colors.primary, 
        borderWidth: 1, 
        borderRadius: 10, 
        padding: 5, 
        margin: 10, 
        height: 50
      }}>
        <Text style={{
          color: theme === 'dark' ? colors.primary : colors.onBackground, 
          marginRight: 10, 
          marginLeft: 10
        }}>
          Notifications
        </Text>
        <Switch
          style={{ marginRight: 50 }}
          size='lg'
          value={notifications}
          onValueChange={() => setNotifications(!notifications)}
          trackColor={{ false: colors.onSurface, true: colors.primary }}
          thumbColor={colors.onBackground}
          ios_backgroundColor={colors.onSurface}
        />  
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>  
          <Text style={{
            color: theme === 'dark' ? colors.primary : colors.onBackground, 
            marginRight: 10
          }}>
            {notifications ? 'On' : 'Off'}
          </Text>
          <Icon 
            as={notifications ? BellIcon : CloseCircleIcon} 
            size='lg' 
            color={theme === 'dark' ? colors.primary : colors.onBackground} 
          />
        </View>
      </View>

      {/* Language Selector - Preserving your original style */}
      <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        width: width, 
        justifyContent: 'space-between', 
        borderColor: colors.primary, 
        borderWidth: 1, 
        borderRadius: 10, 
        padding: 5, 
        margin: 10, 
        height: 50
      }}>
        <Text style={{
          color: theme === 'dark' ? colors.primary : colors.onBackground, 
          marginRight: 10, 
          marginLeft: 10
        }}>
          Language
        </Text>
        <View style={{
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: 140, 
          height: 30, 
          borderColor: colors.primary, 
          borderWidth: 1, 
          borderRadius: 10, 
          padding: 5
        }}>
          <Picker
            style={{
              width: 140, 
              height: 60, 
              color: theme === 'dark' ? colors.primary : colors.onBackground
            }}
            dropdownIconColor={theme === 'dark' ? colors.primary : colors.onBackground}
            mode="dropdown"
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Polski" value="pl" />
            <Picker.Item label="Deutsch" value="de" />
          </Picker>
        </View>
      </View>
    </View>
  )
}

export default Settings