import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity, Platform, LogBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { elevate } from 'react-native-elevate';
import FastImage from 'react-native-fast-image';

import firestore from '@react-native-firebase/firestore';

import Favorites from './Favorites.js';

import HomeSolid from  '../assets/icons/house-solid.svg';
import HomeLight from '../assets/icons/house-light.svg';
import HeartSolid from '../assets/icons/heart-solid.svg';
import HeartLight from '../assets/icons/heart-light.svg';
import AngleRight from '../assets/icons/angle-right.svg';

import Ripple from 'react-native-material-ripple';


LogBox.ignoreLogs(['Setting a timer']);

const sections = ['AMCANA', 'Covid 19', 'English', 'Fandoms', 'Mental Health', 'Rise Against All Odds'];

function Section(props) {
  const [data, setData] = useState([]);
  let section = props.name;
  useEffect(() => {
    async function fetchData() {
        const doc = await firestore().collection('Sections').doc(section).get();
        const docData = doc.data();
        setData(docData.cover.map((cover, index) => { return { id: index, cover: cover, pdf: docData.pdf[index] }}));
    }
    fetchData();
  }, []);

  const renderItem = ({item}) => { return (
    <TouchableOpacity onPress={() => props.navigation.navigate('Pdf', { name: section, item: item })}>
      <FastImage source={{uri: item.cover, priority: FastImage.priority.high }}  style={styles.cover} />
    </TouchableOpacity>
   ) }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionName}>{section}</Text>
      <View style={styles.separator} />
      <FlatList horizontal data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
      <View style={styles.separator} />
      <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Section', { name: section, data: data })}>
        <Text style={styles.buttonText}>See All</Text>
        <AngleRight width={20} height={20} fill={'#0492c2'} />
      </TouchableOpacity>
    </View>
  );
}

function Home({ navigation }) {
    const renderItem = ({item}) => { return <Section name={item} navigation={navigation} /> };
    return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {/* <Text style={styles.title}>Aswini</Text> */}
      <FlatList style={styles.coverList} data={sections} renderItem={renderItem} keyExtractor={(item) => item} />
    </SafeAreaView>
    );
}

const BottomTab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <BottomTab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {height: (Platform.OS === 'android') ? 60 : 100, position: 'absolute', opacity: 0.9 }, tabBarButton: (props) => <Ripple {...props} /> }}>
      <BottomTab.Screen name="Home" component={Home} options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => ((focused) ? <HomeSolid width={35} height={35} fill={color}/> : <HomeLight width={35} height={35} fill={'black'} />)
      }}/>
      <BottomTab.Screen name="Favorites" component={Favorites} options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => ((focused) ? <HeartSolid width={35} height={35} fill={'red'} /> : <HeartLight width={35} height={35} fill={'black'} />)
      }}/>
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  // title: {
  //   fontSize: 50

  // },
  section: {
    backgroundColor: '#ffe3d7',
    // paddingBottom: 20,
    marginBottom: 20,
    ...elevate(5)
  },
  sectionName: {
    color: '#a26857',
    // color: 'white',
    padding: 10,
    fontFamily: 'WeissStd-Bold',
    fontSize: 30,
  },
  separator: {
    borderBottomColor: '#eacdc4',
    borderBottomWidth: 1,
    marginHorizontal: 10

  },
  cover: {
    width: 100,
    height: 150,
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20
  },
  coverList: {
  },
  button: {
    // backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontFamily: 'WeissStd-Bold',
    fontSize: 20,
    color: '#0492c2'
  }
});