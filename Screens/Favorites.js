import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';


export default function Favorites({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => { 
        const getAllFavorites = async () => {
            let keys = [];
            try {
                keys = await AsyncStorage.getAllKeys();
            } catch(e) {
                console.log(e);
            }
            let values;
            try {
                values = await AsyncStorage.multiGet(keys);
            } catch(e) {
                console.log(e);
            }
            setFavorites(values.map((pair) => JSON.parse(pair[1])));
        }
        navigation.addListener('focus', () => {
            getAllFavorites();
        });
    });

    const renderItem = ({item}) => { return (
        <TouchableOpacity onPress={() => navigation.navigate('Pdf', { name: item.id.split('.')[0], item: item })}>
            <FastImage source={loading ? require('../assets/placeholder.png') : {uri: item.cover, priority: FastImage.priority.high }} onLoadEnd={() => setLoading(false)} style={styles.cover} />
        </TouchableOpacity>
    ) }
    const flatListFooter = () => { return <View style={styles.footer}></View>}

    return (
        <SafeAreaView>
            {favorites.length === 0 && <View style={{height: '90%', justifyContent: 'center'}}><Text style={styles.message}>This area is looking quite empty.</Text></View>}
            <FlatList showsVerticalScrollIndicator={false} data={favorites} renderItem={renderItem} keyExtractor={(item) => item.id} ListFooterComponent={flatListFooter} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cover: {
        width: 300,
        height: 450,
        marginTop: 20,
        alignSelf: 'center'
    },
    message: {
        alignSelf: 'center',
        color: 'black',
        fontFamily: 'WeissStd-Bold',
        fontSize: 20
    },
    footer: {
        height: 100,
    }
});