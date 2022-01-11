import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { FlatGrid } from 'react-native-super-grid';
import FastImage from 'react-native-fast-image';


export default function Section({ route, navigation }) {
    const data = route.params.data;
    return (
        <FlatGrid
            itemDimension={150}
            data={data}
            style={styles.gridView}
            // staticDimension={300}
            // fixed
            spacing={25}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Pdf', { name: route.params.name, item: item })}>
                    <FastImage source={{uri: item.cover, priority: FastImage.priority.high }}  style={styles.cover} />
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    cover: {
        width: 150,
        height: 225,
        // marginLeft: 10,
        // marginTop: 20,
        // marginBottom: 20
    },
});