import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import BarsScreen from './screens/BarsScreen';
import { auth } from './firebase.js'
import OverallScoresScreen from './screens/OverallScores.js';





const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState('')


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth.uid)
      }
    })
    console.log(user)
    return unsubscribe
  }, [])



  return (

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


  );
}