import React, { Component, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Button,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Modal,
} from 'react-native';

const PremuimList = ({ data, bottomSheet }) => {

    const openSheet = (data) => {
        bottomSheet(data)
    }

    return (
        <View style={styles.notificationBox}>
            <View style={{ flex: 1 }}>
                <Text style={styles.month}>
                    {data.period_type.charAt(0).toUpperCase() +
                        data.period_type.slice(1)}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.rupee}>${data.price}</Text>
                    <Text style={styles.monthYear}> Free</Text>
                </View>

                <Text style={styles.description}>
                    Pay it forward pays for 4 other gamer
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity
                    style={styles.subscriberButton}
                    onPress={() => openSheet(data)}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                        <Image
                            style={{ height: 15, width: 18 }}
                            source={require('../../../assets/heart.png')}
                        />
                        <Text style={styles.subBtnText}>
                            Subscribe
                        </Text>
                    </View>

                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    notificationBox: {
        padding: 10,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    month: {
        color: 'gray',
        fontFamily: 'Montserrat-Regular',
    },
    rupee: {
        color: '#81b840',
        fontSize: 30,
        fontFamily: 'Montserrat-Bold',
    },
    description: {
        color: 'gray',
        fontFamily: 'Montserrat-Regular',
    },
    buttonView: {
        justifyContent: 'center',
    },
    subscriberButton: {
        backgroundColor: '#81b840',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 50,
        flexDirection: 'row',

        alignItems: 'center',
    },
    subscriberButtonWithStar: {
        backgroundColor: '#81b840',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 50,
        flexDirection: 'row',

        alignItems: 'center',
    },
    monthYear: {
        color: '#81b840',
        alignSelf: 'flex-end',
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
    },
    subBtnText: {
        fontSize: 15,
        color: 'white',
        paddingLeft: 5,
        fontFamily: 'Montserrat-Regular',
    }
})
export default PremuimList