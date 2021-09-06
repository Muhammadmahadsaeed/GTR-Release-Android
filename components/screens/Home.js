import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView, ActivityIndicator, LogBox
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { strTime, setCurrentDate } from './CommonComponents/DateTime';
import IAPPurchaseListener from './CommonComponents/IAPPurchaseListener';
import WinnerList from './WinnerList';
// import firebase from 'react-native-firebase';
const moment = require('moment')
class Home extends Component {
  constructor() {
    super();
    this.state = {
      flashMessage: false,
      data: '',
      winner: '',
      isLoading: true,
      pkgLoading: false
    };
  }

  componentDidMount() {
    // this.checkPermission();
    // this.createChannel();
    // this.notificationListener();
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      this.getWinner()
      if (this.props.user.user.user.user_details.role_id != "3") {
        this.getPackage();
      }
    });
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  getWinner = async () => {
    await fetch(
      'https://app.guessthatreceipt.com/api/gameAnwerList?reward=reward&status=expired',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.props.user.user.user.access_token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((result) => {
        this.setState({ winner: result.data, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false })
        console.log(err);
      });
  }

  async getPackage() {
    await fetch('https://app.guessthatreceipt.com/api/getUserCurrentPackage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.user.user.user.access_token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ data: result.data, isLoading: false });
      })
      .catch((error) => this.setState({ isLoading: false }));
  }

  // async getToken() {
  //   const firebaseToken = await firebase.messaging().getToken();

  //   if (firebaseToken) {
  //     firebase.messaging().subscribeToTopic('topic');
  //   }
  // }

  // async checkPermission() {
  //   const permission = await firebase.messaging().hasPermission();
  //   if (permission) {
  //     this.getToken();
  //   } else {
  //     console.log('nh h====');
  //   }
  // }
  // create channel
  // createChannel = () => {
  //   const channel = new firebase.notifications.Android.Channel(
  //     'channelId',
  //     'channelName',
  //     firebase.notifications.Android.Importance.Max,
  //   ).setDescription('Description');
  //   firebase.notifications().android.createChannel(channel);
  // };
  //foreground notification
  // notificationListener = () => {
  //   firebase.notifications().onNotification((notification) => {
  //     // if(Platform.OS == 'android'){
  //     const localNotification = new firebase.notifications.Notification({
  //       sound: 'default',
  //       show_in_foreground: true,
  //     })
  //       .setNotificationId(notification.notificationId)
  //       .setTitle(notification.title)
  //       .setSubtitle(notification.subtitle)
  //       .setBody(notification.body)
  //       .setData(notification.data)

  //       .android.setChannelId('channelId')
  //       .android.setPriority(firebase.notifications.Android.Priority.High);

  //     firebase
  //       .notifications()
  //       .displayNotification(localNotification)
  //       .catch((err) => console.log(err));
  //     // }
  //   });
  // };

  checkPackage() {
    const role = this.props.user.user.user.user_details.role_id
    // if (role != "3") {
    //   this.setState({ pkgLoading: true })
    //   fetch('https://app.guessthatreceipt.com/api/getUserCurrentPackage', {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${this.props.user.user.user.access_token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((result) => {
    //       this.setState({ pkgLoading: false })
    //       if (result.data == "Unauthenticated." || result.data.exp_status == "expired") {
    //         this.setState({ flashMessage: true }, () => {
    //           setTimeout(() => this.closeFlashMessage(), 3000);
    //         });
    //       }
    //       else {
            this.props.navigation.navigate('DailyChallenges');
    //       }
    //     })
    //     .catch((error) => console.log('error', error));
    // }
    // else {
    //   this.props.navigation.navigate('DailyChallenges');
    // }
  }

  closeFlashMessage() {
    this.setState({
      flashMessage: false,
    });
  }

  moveToWinnerList = () => {
    this.props.navigation.navigate('winnerList')
  }

  moveToPaymentScreen = () => {

    this.props.navigation.navigate('payitforward')
  }
  render() {
    const { data, winner, isLoading, pkgLoading } = this.state
    const role = this.props.user.user.user.user_details.role_id
    return (
      <SafeAreaView style={styles.MainContainer} forceInset={{ top: 'always' }}>
        {isLoading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={60} color="#81b840" />
          </View>
          :
          <View style={{ flex: 1 }}>
            <ScrollView style={[styles.body, { flex: 1 }]}>
              <View style={styles.challengeView}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeViewHeading}>LIVE GAME SHOW</Text>
                  <Text style={styles.challengeViewPara}>
                    Anyone can particapte in this game show and can earn reward.
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',

                  }}>
                  <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 5 }}
                    onPress={() => {
                      this.checkPackage();
                    }}>
                    <Text style={styles.challengeViewTextView}>View</Text>
                    {pkgLoading && <ActivityIndicator size="small" color="#81b840" />}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.boxes}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                  this.checkPackage();
                }}
                  style={[
                    styles.bigBox,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}>
                  <Text
                    style={{
                      fontSize: 50,
                      fontFamily: 'Montserrat-ExtraBold',
                      color: 'white',
                    }}>
                    GTR
                  </Text>
                </TouchableOpacity>
                <View style={[styles.smallBox, { justifyContent: 'center' }]}>
                  <View style={{ marginLeft: 15 }}>
                    <Text
                      style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                      Date
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        color: 'white',
                      }}>
                      {setCurrentDate}
                    </Text>
                  </View>
                  <View style={{ marginTop: 15, marginLeft: 15 }}>
                    <Text
                      style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
                      Time
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        color: 'white',
                      }}>
                      {strTime}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.challengeView}>
                <View>
                  <Text style={styles.challengeViewHeading}>
                    WINNERS OF THE DAY
                  </Text>
                  <Text style={styles.challengeViewPara}>
                    Daily winner list availble with past record
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 10 }} onPress={() => this.moveToWinnerList()}>
                    <Text style={styles.challengeViewTextView}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.boxes}>
                <View
                  style={[
                    styles.smallBox,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}>
                  <Image
                    source={require('../../assets/cupIcon.png')}
                    style={styles.userIcon}
                  />
                </View>
                <View style={[styles.bigBox, { padding: 10 }]}>
                  <FlatList
                    initialNumToRender={2}
                    data={winner}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <WinnerList
                        data={item}
                      />
                    )}
                  />
                </View>
              </View>

              {role != "3" ?
                <>
                  <View style={styles.challengeView}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.challengeViewHeading}>PAY IT FORWORD</Text>
                      <Text style={styles.challengeViewPara}>
                        PIF here you can pay for others this way many people can play this game
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity onPress={() => this.moveToPaymentScreen()} style={{ paddingVertical: 5 }}>
                        <Text style={styles.challengeViewTextView}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.boxes}>
                    <View
                      style={[
                        styles.payItSmallBox,
                        { justifyContent: 'center', alignItems: 'center' },
                      ]}>
                      <Image
                        source={require('../../assets/shopIcon.png')}
                        style={styles.shopIcon}
                      />
                    </View>
                    <View style={[styles.payItBigBox, { padding: 10 }]}>
                      <View style={styles.notificationBox}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text style={styles.month}>{data != 'Unauthenticated.' && data.exp_status.toUpperCase()}</Text>
                          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={styles.rupee}>
                              {data != 'Unauthenticated.' && data.amount}
                            </Text>
                            <Text numberOfLines={1} style={[styles.month, { alignSelf: 'flex-end', marginLeft: 5, flex: 1 }]}>
                              {data != 'Unauthenticated.' && data.subscription.description.toUpperCase()}
                            </Text>
                          </View>

                          <Text style={styles.description}>
                            {data != 'Unauthenticated.' && `Exp: ${moment(data.exp_date).format('ll')}`}
                          </Text>

                        </View>
                        <View style={styles.buttonView}>
                          <TouchableOpacity
                            style={styles.subscriberButton}
                            onPress={() => {
                              this.moveToUserList();
                            }}>
                            <Image
                              style={{ height: 15, width: 18 }}
                              source={require('../../assets/heart.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
                : null}
            </ScrollView>
            {this.state.flashMessage ? (
              <View style={styles.flashMessage}>
                <Text
                  style={{ color: 'white', fontFamily: 'Montserrat-Regular' }}>
                  Your package has been expired
                </Text>
              </View>
            ) : null}
          </View>
        }
        {/* <IAPPurchaseListener /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },

  body: {
    marginTop: 20,
    width: '96%',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  challengeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  challengeViewHeading: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: '#81b840',
  },
  challengeViewPara: {
    fontFamily: 'Montserrat-Regular',
    color: 'gray',
    fontSize: 12,
  },
  challengeViewTextView: {
    fontFamily: 'Montserrat-Bold',
    color: '#81b840',
  },
  boxes: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  bigBox: {
    // height: 150,
    width: '66%',
    backgroundColor: '#81b840',
    borderRadius: 15,
    // justifyContent: 'center',
  },
  smallBox: {
    height: 150,
    width: '32%',
    backgroundColor: '#81b840',
    borderRadius: 15,
  },
  payItBigBox: {
    // height: 150,
    width: '66%',
    backgroundColor: '#81b840',
    borderRadius: 15,
    justifyContent: 'center',
  },
  payItSmallBox: {
    height: 100,
    width: '32%',
    backgroundColor: '#81b840',
    borderRadius: 15,
  },
  userIcon: {
    height: 85,
    width: 70,
  },
  shopIcon: {
    height: 60,
    width: 65,
  },
  notificationBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  month: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  rupee: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  buttonView: {
    justifyContent: 'center',
  },
  subscriberButton: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYear: {
    alignSelf: 'flex-end',
    fontFamily: 'Montserrat-Regular',
    color: 'white',
  },

  flashMessage: {
    position: 'absolute',
    backgroundColor: 'red',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    bottom: 0,
  },
});
const mapStateToProps = (state) => {
  return {
    user: state,
  };
};
export default connect(mapStateToProps, null)(Home);
