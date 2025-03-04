import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Input, InputField } from "@/components/ui/input"
import {FormControl, FormControlError, FormControlErrorText, FormControlErrorIcon, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText} from "@/components/ui/form-control"

const Register = () => {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

  return (
    <SafeAreaView className='p-4'>
        <View className='justify-center content-center w-full h-full'>
            <Box className='p-6 bg-white rounded-lg shadow-lg '>
                <Text className='text-lg font-bold '>Username</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                    <InputField placeholder="Username" />   
                </Input>
                <Text className='text-lg font-bold mt-4'>E-mail</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                    <InputField placeholder="E-mail" />
                </Input>
                <Text className='text-lg font-bold mt-4'>Password</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                    <InputField placeholder="Password" type='password' onChangeText={setPassword} value={password}/>
                </Input>    
                <Text className='text-lg font-bold mt-4'>Repeat password</Text>
                <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                    <InputField placeholder="Repeat password" />
                </Input>    
            </Box>
        </View>
    </SafeAreaView>
  )
}

export default Register