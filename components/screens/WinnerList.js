import moment, { defaultFormatUtc } from 'moment';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

const WinnerList = ({ data }) => {
    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <View
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 50,
                        borderColor: 'white',
                        borderWidth: 2,
                    }}>
                    <Image
                        source={require('../../assets/dummy.png')}
                        style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'cover',
                        }}
                    />
                </View>
                <View style={{ marginLeft: 5, justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontFamily: 'Montserrat-Bold',
                            color: 'white',
                        }}>
                        {data.user.first_name.toUpperCase()} {data.user.last_name.toUpperCase()}
                    </Text>
                    <Text style={[styles.challengeViewPara, { color: 'white' }]}>
                        {moment(data.created_at).format('lll')}
                    </Text>
                </View>
            </View>
            <View style={styles.seperator}></View>
        </>
    )
}

export default WinnerList

const styles = StyleSheet.create({
    challengeViewPara: {
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        fontSize: 12,
    },
    seperator: {
        height: 1,
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: 10,
      },
})