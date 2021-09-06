import React from 'react';
import {

  StyleSheet,
  ImageBackground,
  View, Image, ActivityIndicator

} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import NoInternetModal from '../../CommonComponents/NoInternetModal';


class SplashScreen extends React.Component {
  _isMounted = false;
  constructor() {
    super()
    this.state = {
      loading: true,
      noInternet: false
    }
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
    // setTimeout(() => {
      this.netStatusListener()
    //   this.setTimePassed();
    // }, 1000);
  }
  }
  checkUser = () => {
    this.setState({ loading: false })
    if (this.props.user.user.user !== null) {
      this.props.navigation.navigate('Drawer');
    }
    else {
      this.props.navigation.navigate('AuthScreen')
    }
  }

  netStatusListener = () => {
    NetInfo.fetch().then((connectionInfo) => {
      if (connectionInfo.isConnected === false) {
        this.setState({ noInternet: true});
      } else {
        this.setState({ noInternet: false});
        this.checkUser()
      }
    });
  };

  updateInternetModal = (val) => {
  
    this.setState({ noInternet: val});
    this.netStatusListener()
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { noInternet } = this.state

    return (
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../../../../assets/bg.png')}>
          <View style={styles.logoContainer}>
            <View style={styles.centerImage}>
              <Image style={styles.logo} source={require('../../../../assets/Logo.png')} />
            </View>
            <ActivityIndicator size="large" color="white" />
          </View>
        </ImageBackground>
        {noInternet && <NoInternetModal
          ref={(ref) => {
            this.noInternetModal = ref;
          }}
          visible={noInternet}
          updateState={this.updateInternetModal}
        />}
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  logoContainer: {

    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  centerImage: {

    justifyContent: "center",
    alignItems: "center",
    height: 400,
    width: "80%"
  },
  logo: {
    height: 150,
    width: "100%"
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',

  },
});


const mapStateToProps = (state) => {
  return {
    user: state,
  };
};
export default connect(mapStateToProps, null)(SplashScreen);