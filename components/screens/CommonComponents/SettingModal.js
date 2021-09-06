import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Linking,
    TouchableWithoutFeedback,
} from 'react-native';

class SettingModal extends React.Component {
    constructor() {
        super();

        this.state = {
            modalVisible: true,
        };
    }

    show = () => {

        this.setState({ modalVisible: true });
    };
    close = () => {
        this.setState({ modalVisible: false });
        this.props.onClose()
    };

    goToSettings = () =>{
        Linking.openSettings()
    }

    render() {
        const { modalVisible } = this.state;

        return (
            <Modal
                animationType="fade"
                visible={modalVisible}
                onRequestClose={this.close}>
                <TouchableOpacity style={styles.container} onPress={() => this.close()}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <View style={styles.header}>
                                <Image source={require('../../../assets/camera.png')} 
                                style={{ height: 50, width: 50 }} 
                                resizeMode="contain"
                                />
                            </View>
                            <View style={styles.footer}>
                                <Text style={styles.para}>
                                    To capture videos, allow GTR access to your camera and mic.
                                    Tap Settings Permissions, and turn Camera and Mic on.
                                </Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={styles.notBtn} activeOpacity={0.8} onPress={() => this.close()}>
                                        <Text style={styles.btnText}>Not Now</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.settingBtn} activeOpacity={0.8} onPress={() => this.goToSettings()}>
                                        <Text style={styles.btnText}>Settings</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 5,
    },
    header: {
        backgroundColor: '#81b840',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    para: {
        fontFamily: 'Montserrat-Regular',
        textAlign: 'justify'
    },
    footer: {
        padding: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    notBtn: {
        padding: 10,
        marginRight: 10
    },
    settingBtn: {
        paddingVertical: 10
    },
    btnText: {
        fontFamily: 'Montserrat-Bold',
        color: '#81b840',
        fontSize: 14,
    }
});

export default SettingModal;
