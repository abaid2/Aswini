import { StyleSheet, Text, View, Button, FlatList, SafeAreaView, TouchableOpacity, Platform, LogBox } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  let section = props.name;
  useEffect(() => {
    async function fetchData() {
        const doc = await firestore().collection('Sections').doc(section).get();
        const docData = doc.data();
        setData(docData.cover.map((cover, index) => { return { id: section + '.' + index, cover: cover, pdf: docData.pdf[index] }}));
    }
    fetchData();
  }, []);

  const renderItem = useCallback(({item}) => { return (
    <TouchableOpacity onPress={() => props.navigation.navigate('Pdf', { name: section, item: item })}>
     <FastImage source={loading ? require('../assets/placeholder.png') : {uri: item.cover, priority: FastImage.priority.high}}  onLoad={() => setLoading(false)} style={styles.cover} />
    </TouchableOpacity>
  ) }, [loading]);

  const flatListFooter = useCallback(() => { return <View style={styles.footer1}></View>}, []);
  const keyExtractor = useCallback((item) => item.id, []);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionName}>{section}</Text>
      <View style={styles.separator} />
      <FlatList style={styles.coverList} horizontal maxToRenderPerBatch={8} showsHorizontalScrollIndicator={false} data={data} renderItem={renderItem} keyExtractor={keyExtractor} ListFooterComponent={flatListFooter} />
      <View style={styles.separator} />
      <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Section', { name: section, data: data })}>
        <Text style={styles.buttonText}>See All</Text>
        <AngleRight width={20} height={20} fill={'#0492c2'} />
      </TouchableOpacity>
    </View>
  );
}

function Home({ navigation }) {
    const [sectionList, setSectionList] = useState([]);
    useEffect(() => { setSectionList(sections.sort(() => Math.random() - 0.5)); }, []);
    const flatListHeader = useCallback(() => { return <Text style={styles.title}>Aswini</Text> }, []);
    const flatListFooter = useCallback(() => { return <View style={styles.footer2}></View>}, []);
    const renderItem = useCallback(({item}) => { return <Section name={item} navigation={navigation} /> }, []);
    const keyExtractor = useCallback((item) => item, []);
    return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <FlatList ListHeaderComponent={flatListHeader} ListFooterComponent={flatListFooter} showsVerticalScrollIndicator={false} data={sectionList} renderItem={renderItem} keyExtractor={keyExtractor} />
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
  title: {
    fontSize: 60,
    fontFamily: 'Autography',
    padding: 10,
    color: 'black'
  },
  section: {
    backgroundColor: '#ffe3d7',
    // paddingBottom: 20,
    marginBottom: 20,
    ...elevate(5)
  },
  sectionName: {
    backgroundColor: '#FFF4EF',
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
    height: 190
  },
  button: {
    backgroundColor: '#FFF4EF',
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
  },
  footer1: {
    width: 10,
  },
  footer2: {
    height: 100,
  }
});