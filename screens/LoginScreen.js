import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Image } from 'react-native-elements';
import { auth} from '../firebase'

const LoginScreen = () => {
  const LoginImage = require('../assets/loginImage2.png');


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch(() => {
          createUserWithEmailAndPassword(auth, email, password)
            .catch((createUserError) => {
              console.error('Error creating user:', createUserError);
            });
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : undefined}
      style={tw`flex-1 bg-black items-center mt-[-70px]`}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 300}
    >
      <View style={tw`flex-1 bg-black pt-10 items-center justify-center`}>
        <Text style={tw`mb-5 text-white text-2xl font-bold`}>GUINNESS FIGHT</Text>
        <Image source={LoginImage} style={tw`w-[300px] h-[300px] mb-5`} />
        <Text style={tw` mb-2 text-white`}>Email:</Text>
        <TextInput
          style={tw`p-2 border border-gray-300 rounded text-white w-60 bg-opacity-80`}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <Text style={tw`mt-2 mb-2 text-white`}>Password:</Text>
        <TextInput
          style={tw`p-2 border border-gray-300 rounded text-white w-60 bg-opacity-80`}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <View style={tw`mt-5 p-2 bg-white text-black rounded`}>
          <Button
            title="My Drinking Shoes Are On"
            onPress={handleEmailLogin}
            color="#000"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
