import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAllFavorites = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      console.log(e);
    }
  
    console.log(keys);
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }

export default function Favorites({ navigation }) {
    useEffect(() => { 
        navigation.addListener('focus', () => {
            getAllFavorites();
        });
    });
    return (
        <Text>Favorites</Text>
    );
}