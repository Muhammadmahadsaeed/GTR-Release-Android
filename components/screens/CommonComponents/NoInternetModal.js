import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default class NoInternetModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: this.props.visible
        };
    }

    // componentWillReceiveProps(newProps) {
    //     if (newProps.visible !== this.state.modalVisible) {
    //         this.setModalVisible(newProps.visible)
    //     }
    // }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
        this.props.updateState(visible)
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.modalView}>
                    <Image source={require('../../../assets/offline.png')}
                        tintColor="white"
                        style={styles.img}
                        resizeMode="contain" />
                    <Text style={styles.unableText}>
                        Unable to reach your other half
                    </Text>
                    <Text style={styles.internetErorr}>
                        Please check your internet connection and restart the application
                    </Text>
                    <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={()=> this.setModalVisible(false)}>
                        <Text style={styles.btnText}>Reload</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1, backgroundColor: '#81b840',
        justifyContent: 'center', alignItems: 'center',
        padding: 40
    },
    img: {
        tintColor: 'white', width: 150, height: 150
    },
    unableText: {
        color: 'white', fontWeight: 'bold', paddingTop: 25, fontSize: 17, paddingHorizontal: 15, textAlign: 'center'
    },
    internetErorr: {
        color: 'white', fontSize: 17, paddingHorizontal: 15, textAlign: 'center', paddingTop: 5
    },
    btn: {
        marginTop: 40,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
    }
})
