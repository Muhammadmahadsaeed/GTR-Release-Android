import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import ModalView from './Modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButtonRN from 'radio-buttons-react-native';

const radio_props = [
  {
    label: 'Paypal'
  },
  {
    label: 'Apple Pay'
  }
];

class PayItForwardScreen extends Component {
  constructor() {
    super();
    this.modalRef = React.createRef();
    this.state = {
      showModal: false,
      status: 'Pending',
      loading: false,
      getPremium: '',
      amount: 0,
      appleAmount: '',
      package: '',
    };
  }

  componentDidMount() {
    this.getPackages()
  }

  getPackages = async () => {
    await fetch('https://app.guessthatreceipt.com/api/subscriptions?type=forward', {
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.props.user.user.access_token}`,
      }
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ getPremium: result.data });
      })
      .catch((error) => console.log('error', error));
  }

  handleResponse = (data) => {
    let url = data.url;
    let fields = url.split('?');
    let paymentId = fields[1];
    let formdata = new FormData();

    if (data.title === 'success') {
      formdata.append('pack_id', this.state.package.id);
      formdata.append('transaction_id', paymentId);
      fetch('https://app.guessthatreceipt.com/api/saveOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.user.user.access_token}`,
        },
        body: formdata,
      })
        .then((response) => response.json())

        .then((data) => {

          this.setState({ showModal: false, status: 'Complete' });
          this.setModalVisible();
        })
        .catch((error) => {
          console.log('====', error);
        });
    } else if (data.title === 'cancel') {
      this.setState({ showModal: false, status: 'Cancelled' });
    } else {
      return;
    }
  };

  goToPaypal() {
    this.setState({
      showModal: true,
      amount: this.state.package.price,
    })

  }
  setModalVisible() {
    this.modalRef.show();
  }
  goToApplePay = () => {
    // this.props.navigation.navigate('ApplePayScreen', { amount: this.state.appleAmount })
  }
  goToPayment = (e) => {
    this.RBSheet.close();
    const { label } = e
    if (label == 'Paypal') {
      this.goToPaypal()
    }
    else {
      this.goToApplePay()
    }
  }
  renderContent = () => (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <RadioButtonRN
        // initial={-1}
        data={radio_props}
        textStyle={styles.radioText}
        activeColor={'#81b840'}
        selectedBtn={(e) => this.goToPayment(e)}
      />
    </View>
  );

  openBottomSheet = (item) => {
    this.setState({ package: item })
    this.RBSheet.open();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.paymentContainer}>
          <View style={styles.paymentText}>
            <Text
              style={{
                color: '#81b840',
                fontSize: 20,
                fontFamily: 'Montserrat-Bold',
              }}>
              Pay it forward
            </Text>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Regular',
                }}>
                Get access to financia estimates
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Regular',
                }}>
                and GTR platform with Premium Subscribtion
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: '95%', alignSelf: 'center', flex: 1 }}>
          {!this.state.getPremium ? (
            <View style={styles.ActivityIndicatorStyle}>
              <ActivityIndicator color="#009688" size="large" />
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.getPremium}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.notificationBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.month}>
                      {item.period_type.charAt(0).toUpperCase() +
                        item.period_type.slice(1)}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.rupee}>${item.price}</Text>
                      <Text style={styles.monthYear}> Free</Text>
                    </View>

                    <Text style={styles.description}>
                      Pay it forward pays for 4 other gamer
                    </Text>
                  </View>
                  <View style={styles.buttonView}>
                    <TouchableOpacity
                      style={styles.subscriberButton}
                      onPress={() => this.openBottomSheet(item)}
                    >
                      <Image
                        style={{ height: 15, width: 18 }}
                        source={require('../../../assets/heart.png')}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'white',
                          paddingLeft: 5,
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        Subscribe
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={200}
          closeOnDragDown={true}
          openDuration={300}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
            },
          }}>
          {this.renderContent()}
        </RBSheet>

        <ModalView ref={(target) => (this.modalRef = target)} />
        <Modal
          animationType="slide"
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <WebView
            style={{ flex: 1 }}
            source={{
              uri: `http://pombopaypal.guessthatreceipt.com/paypal/${this.state.amount}`,
            }}
            originWhitelist={['*']}
            onNavigationStateChange={(data) => this.handleResponse(data)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View style={styles.ActivityIndicatorStyle}>
                <ActivityIndicator color="#009688" size="large" />
              </View>
            )}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paymentContainer: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  paymentButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 30,
  },
  paymentButtonText: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  paymentText: {
    marginTop: 10,
    alignItems: 'center',
  },
  notificationBox: {
    flex: 1,
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
    // fontWeight: 'bold',
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
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 50,
    flexDirection: 'row',

    alignItems: 'center',
  },
  monthYear: {
    alignSelf: 'flex-end',
    fontFamily: 'Montserrat-Regular',
    color: 'gray',
  },

  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    color: '#81b840',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
});
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, null)(PayItForwardScreen);
