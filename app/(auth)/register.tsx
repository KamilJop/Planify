import { View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from '@/components/ui/form-control';
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Image } from '@/components/ui/image';
const googleIcon = require('@/assets/images/google.svg');
const githubIcon = require('@/assets/images/github.svg');
const Register = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [isInvalidLogin, setIsInvalidLogin] = React.useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = React.useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
  const [isInvalidRepeatPassword, setIsInvalidRepeatPassword] = React.useState(false);

  const handleLogin = () => {
    const isUsernameValid = username.length >= 6;
    setIsInvalidLogin(!isUsernameValid);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email) && email.length > 6;
    setIsInvalidEmail(!isEmailValid);

    const isPasswordValid =
      password.length >= 6 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password);
    setIsInvalidPassword(!isPasswordValid);

    const isRepeatPasswordValid = password === repeatPassword;
    setIsInvalidRepeatPassword(!isRepeatPasswordValid);

    if (isUsernameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid) {
      console.log('All fields are valid. Proceeding to register...');
      router.push('../(tabs)/index'); 
    } else {
      console.log('Validation failed. Please check your inputs.');
    }
  };

  const handleShowPassword = () => {
    setShowPassword((showState) => !showState);
  };

  return (
    <SafeAreaView className="p-4 ">
      <View className="justify-center content-center w-full h-full">
        <Box className="p-6 rounded-lg  gap-1 border-solid border-2 ">
          {/* Username Field */}
          <FormControl isInvalid={isInvalidLogin} size="md">
            <FormControlLabel>
              <FormControlLabelText className="font-bold text-xl">Username</FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                type="text"
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
                value={username}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText className="text-xs text-gray-600 ml-1">
                Username must be at least 6 characters long
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-600" />
              <FormControlErrorText className="text-red-600">Invalid username</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Email Field */}
          <FormControl isInvalid={isInvalidEmail} size="md">
            <FormControlLabel>
              <FormControlLabelText className="font-bold text-xl">E-mail</FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                type="text"
                placeholder="E-mail"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-600" />
              <FormControlErrorText className="text-red-600">Invalid e-mail</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Password Field */}
          <FormControl isInvalid={isInvalidPassword} size="md">
            <FormControlLabel>
              <FormControlLabelText className="font-bold text-xl">Password</FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                onChangeText={setPassword}
                value={password}
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-600" />
              </InputSlot>
            </Input>
            <FormControlHelper>
              <FormControlHelperText className="text-xs text-gray-600 ml-1">
                Password must be at least 6 characters long, contain a capital letter, and a special
                character
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-600" />
              <FormControlErrorText className="text-red-600">Invalid password</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Repeat Password Field */}
          <FormControl isInvalid={isInvalidRepeatPassword} size="md">
            <FormControlLabel>
              <FormControlLabelText className="font-bold text-xl">
                Repeat password
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                placeholder="Repeat password"
                type={showPassword ? 'text' : 'password'}
                onChangeText={setRepeatPassword}
                value={repeatPassword}
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-600" />
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-600" />
              <FormControlErrorText className="text-red-600">
                Passwords do not match
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Register Button */}
          <Button onPress={handleLogin} className="mt-4 bg-slate-100"  variant="outline">
            <ButtonText>Register</ButtonText>
          </Button>

          <Text className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Text onPress={() => router.push('../(auth)/login')} className="text-blue-600">
              Login
            </Text>
          </Text>
          <Text className="text-center mt-4 text-gray-600">
            Or sign up using social media
          </Text>
          <View className="flex flex-row justify-center items-center mt-6">
            <Pressable onPress={() => router.push('../(tabs)/index')} className="mx-2">
              <Image source={googleIcon} alt='google' className='w-16 h-16' />
            </Pressable>
            <Pressable onPress={() => router.push('../(tabs)/index')} className="mx-2">
              <Image source={githubIcon} alt='github' className='w-16 h-16'/>
            </Pressable>
          </View>
        </Box>
      </View>
    </SafeAreaView>
  );
};

export default Register;