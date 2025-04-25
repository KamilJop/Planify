// app/(tabs)/settings.tsx
import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Switch } from '@/components/ui/switch'
import { BellIcon, CloseCircleIcon, Icon } from '@/components/ui/icon'
import { ChevronDownIcon } from "@/components/ui/icon"
import { Picker } from '@react-native-picker/picker'
import { useTheme } from '@/components/ThemeContext'

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

      {/* Notifications Toggle - Preserving your original style */}
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