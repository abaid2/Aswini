import { StyleSheet, ActivityIndicator, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeartSolid from '../assets/icons/heart-solid.svg';
import HeartLight from '../assets/icons/heart-light.svg';

const storeFavorite = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
    console.log('Added.');
}

const removeFavorite = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      console.log(e);
    }
  
    console.log('Removed.');
}

export default function PdfScreen({ route, navigation }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const item = route.params.item;
    const section = route.params.name;
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => { 
                    setIsFavorite(!isFavorite);
                    let key = section.concat(item.id);
                    if (!isFavorite) { storeFavorite(key, item); } else { removeFavorite(key); }
                }}>
                    {isFavorite ? <HeartSolid style={styles.favoriteButton} width={30} height={30} fill='red'/> : <HeartLight style={styles.favoriteButton} width={30} height={30} fill='black' />}
                </TouchableOpacity>
            ),
        })
    }, [navigation, isFavorite]);
    return (
        <SafeAreaView style={styles.container}>
            <Pdf
                source={{ cache: false, uri: item.pdf }}
                horizontal
                fitWidth
                renderActivityIndicator={() => <ActivityIndicator size="large" color='lightblue'/>}
                // fitPolicy={0}
                // singlePage
                enablePaging
                onLoadComplete={(numberOfPages,filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                onPageSingleTap={(page) => {
                    // navigation.setParams({ showHeader: !(route.params.showHeader)});
                }}
                style={styles.pdf}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginTop: 25,
      },
      pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
      },
      favoriteButton: {
          marginHorizontal: 10
      }
});
