import 'react-native-gesture-handler';
import { StyleSheet, Text, StatusBar, View, Image, SafeAreaView, Pressable, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';

import HomeTabs from './Screens/Home.js';
import Section from './Screens/Section.js';
import Pdf from './Screens/Pdf.js';


export default function App() {
  const [timePassed, setTimePassed] = useState();  
  setTimeout(function() { setTimePassed(true) }, 2000)
  if (!timePassed) { return (
    <View>
      <Image style={styles.cover}  resizeMode='stretch' source={require("./assets/new.jpg")} />
      <StatusBar hidden style="auto" />
    </View>
  )} else return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen options={{headerShown: false}} name="HomeTabs" component={HomeTabs} />
    <Stack.Screen options={({route }) => ({ title: route.params.name, headerBackTitle: 'Home '})} name="Section" component={Section} />
    <Stack.Screen options={({ route }) => ({ title: route.params.name, headerBackTitle: 'Back' })} name="Pdf" component={Pdf}  />
  </Stack.Navigator>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: '100%', 
    height: '100%',
  }
});