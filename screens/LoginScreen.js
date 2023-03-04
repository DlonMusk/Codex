import { Text, View, SafeAreaView, Image, TextInput } from 'react-native'
import React from 'react'
import Book from '../assets/Book.png'
import { auth } from '../firebase'

const LoginScreen = () => {

    return (
        <SafeAreaView className='h-screen flex items-center bg-[#9f9a9a]'>
            {/* LOGO */}
            <Image className='absolute bottom-10' source={Book} />
            <Text className="text-black text-[50px] tracking-[15px] mt-24">CODEX</Text>
            <View className='w-2/3 h-3/6 mb-28 bg-[#ffffffca]'>
                <TextInput placeholder='EMAIL'/>
                <TextInput placeholder='PASSWORD'/>
            </View>
            <View>
                {/* GOOGLE AUTH HERE */}
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

