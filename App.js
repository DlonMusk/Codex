import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TailwindProvider } from 'tailwindcss-react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import BarsScreen from './screens/BarsScreen';
import { db, auth } from './firebase.js'
import OverallScoresScreen from './screens/OverallScores.js';





const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        getDoc(doc(db, "users", userAuth.uid)).then(doc => {
          if (doc.exists()) {
            const userData = doc.data()
            setUser(userAuth.uid)
          }
          else {
            console.log("no document")
          }
        })

      }
    })
    console.log(user)
    return unsubscribe
  }, [])



  return (

    <TailwindProvider >
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <Stack.Screen
              name='Login'
              component={LoginScreen}
            />
          ) : (
            <>
              <Stack.Screen
                name='Bars'
                component={BarsScreen}
                initialParams={{ uid: user }}
              />
              <Stack.Screen
                name='Overall Scores'
                component={OverallScoresScreen}
                initialParams={{ uid: user }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>


  );
}