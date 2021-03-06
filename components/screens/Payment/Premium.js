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
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import ModalView from './Modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButtonRN from 'radio-buttons-react-native';
import PremuimList from './PremiumList';

const radio_props = [
  {
    label: 'Paypal'
  },
  {
    label: 'Apple Pay'
  }
];
class Premium extends Component {
  constructor(props) {
    super();
    this.state = {
      getPremium: '',
      amount: 0,
      status: 'Pending',
      showModal: false,
      package: '',
      modalText: '',
    };
  }
  componentDidMount() {
    this.getPackages()
  }

  getPackages = async () => {
    await fetch(
      'https://app.guessthatreceipt.com/api/subscriptions?type=premium',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.user.user.access_token}`,
        },
      },
    )
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

  openBottomSheet = (item) => {
    let formdata = new FormData();
    this.setState({ package: item });
    if (item.price === '0.00') {
      this.setState({ isPackageLoading: true })
      formdata.append('pack_id', item.id);
      formdata.append('transaction_id', item.description);
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
        this.setModalVisible();
      })
      .catch((error) => {
        console.log('====', error);
      });
    } else {
      this.RBSheet.open();
    }
  };

  setModalVisible() {
    this.modalRef.show();
  }

  goToPayment = (e) => {
    this.RBSheet.close();
    const { label } = e
    if (label == 'Paypal') {
      this.goToPaypal()
    }
    else {
      console.log("apple=====");
    }
  }

  goToPaypal() {
    this.setState({
      showModal: true,
      amount: this.state.package.price,
    })
  }

  renderContent = () => (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <RadioButtonRN
        //  initial={1}
        data={radio_props}
        textStyle={styles.radioText}
        activeColor={'#81b840'}
        selectedBtn={(e) => this.goToPayment(e)}
      />
    </View>
  );

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
              Become a premium
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
                <PremuimList data={item} bottomSheet={this.openBottomSheet} />
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

        <ModalView
          ref={(target) => (this.modalRef = target)}
          text={this.state.modalText}
        />
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

  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  restore: {
    color: 'gray',
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
  },
  termText: {
    paddingRight: 27,
    fontFamily: 'Montserrat-Bold',
  },
  policyText: {
    paddingLeft: 27,
    fontFamily: 'Montserrat-Bold',
  },
  para: {
    marginTop: 30,
    fontFamily: 'Montserrat-Regular',
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetView: {
    paddingHorizontal: 10,
    marginHorizontal: 20,
    flexDirection: "row",
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
export default connect(mapStateToProps, null)(Premium);
