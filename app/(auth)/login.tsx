import { View, SafeAreaView, ToastAndroid, Alert, Modal ,StyleSheet} from 'react-native';
import React from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Image } from '@/components/ui/image';

const googleIcon = require('@/assets/images/google.svg');
const githubIcon = require('@/assets/images/github.svg');



const LoginScreen = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const handleShowPassword = () => {
    setShowPassword((showState) => !showState);
  };


  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Provided data is invalid. Please try again.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      router.push('../(tabs)/index');
    } else {
      console.log('Invalid credentials. Please try again.');
      showToast();
    }
  };

  return (
    <SafeAreaView className='justify-center content-center w-full h-full'>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
            
          <View style={styles.centeredView}>
            <View className='bg-white p-5 rounded-lg items-center m-20 justify-center' style={styles.modalView}>
              <Text className='text-xl font-bold'>Are you sure?!</Text>
              <Text>By continuing as a guest, you will not be able to save your progress.</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15}}>
              <Pressable
                className='bg-red-500 p-5 rounded-lg'
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Take me back to login</Text>
              </Pressable>
              <Pressable
                className='bg-green-500 p-5 rounded-lg'
                onPress={() => router.push('../(tabs)/index')}>
                <Text style={styles.textStyle}>Continue as guest</Text>
              </Pressable>
            
              </View>
            </View>
          </View>
        </Modal>
      <Text className="text-4xl font-bold text-center">Login to your Planify account!</Text>
      <Box className="p-6 rounded-lg gap-1">
        <FormControl size="md">
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
        </FormControl>
        <FormControl size="md">
          <FormControlLabel>
            <FormControlLabelText className="font-bold text-xl">Password</FormControlLabelText>
          </FormControlLabel>
          <Input size="md">
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <InputSlot className="pr-3" onPress={handleShowPassword}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-600" />
            </InputSlot>
          </Input>

          <Button className="mt-4" onPress={handleLogin} variant='outline'>
            <ButtonText>Login</ButtonText>
          </Button>
          <Button className="mt-4 max-h-8 content-center justify-center"  variant='outline' onPress={() => setModalVisible(!modalVisible)}>
            <ButtonText>Continue as guest</ButtonText>
          </Button>
        </FormControl>
      </Box>

      <View className="flex-row justify-center content-center">
        <Text className="text-blue-500" onPress={() => router.push('/(auth)/recovery')}>Forgot your password?</Text>
      </View>
      <View className="flex-row justify-center mt-4 content-center">
        <Text className="text-xs ml-1">Don't have an account yet?<Text className="text-blue-500 text-2xs" onPress={() => router.push('/(auth)/register')}> Register here</Text></Text>
      </View>
      <View className="flex-row justify-center mt-4 content-center">
        <Text className="text-xs ml-1">Or sign in using social media</Text>
      </View>
      <View className="flex flex-row justify-center items-center mt-6">
            <Pressable onPress={() => router.push('../(tabs)/index')} className="mx-2">
              <Image source={googleIcon} alt='google' className='w-16 h-16' />
            </Pressable>
            <Pressable onPress={() => router.push('../(tabs)/index')} className="mx-2">
              <Image source={githubIcon} alt='github' className='w-16 h-16'/>
            </Pressable>
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 1,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginScreen;