import React, {useState} from 'react';

//Import all required component
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {connect} from 'react-redux';


class SignupScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      pNum: '',
      password: '',
      confirmPassword: '',
      hidePassword: true,
      hideConfirmPassword: true,
      isErorr: false,
      isloading: false,
      wrong: false,
      showPasswordNotMatch: false,
      correct: false,
      passwordConfirmed: false,
      firstNameErorr: false,
      lastNameErorr: false,
      emailErorr: false,
      pNumErorr: false,
      pwdErorr: false,
      cPwdErorr: false,
      showErorr: '',
    };
  }
  validate = (text) => {
    const userEmail = text.toLowerCase();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(userEmail) === false) {
      this.setState({correct: false});
      this.setState({wrong: true});
      this.setState({emailErorr: false});
      return false;
    } else {
      this.setState({correct: true});
      this.setState({wrong: false});
      this.setState({emailErorr: false});
      this.setState({email: userEmail});
    }
  };
  setPasswordVisibale() {
    this.setState({hidePassword: !this.state.hidePassword});
  }
  setConfirmPasswordVisibale() {
    this.setState({hideConfirmPassword: !this.state.hideConfirmPassword});
  }
  moveToSignin() {
    this.props.navigation.navigate('Login');
  }
  moveToChooseImage() {
    this.setState({isloading: true});
    const {
      firstName,
      lastName,
      email,
      pNum,
      password,
      confirmPassword,
    } = this.state;
    if (
      firstName === '' &&
      lastName === '' &&
      email === '' &&
      pNum === '' &&
      password === '' &&
      confirmPassword === ''
    ) {
      this.setState({
        firstNameErorr: true,
      });
      this.setState({
        lastNameErorr: true,
      });
      this.setState({
        emailErorr: true,
        wrong: false,
        correct: false,
      });
      this.setState({
        pNumErorr: true,
      });
      this.setState({
        pwdErorr: true,
      });
      this.setState({
        cPwdErorr: true,
      });
    } else if (firstName == '') {
      this.setState({firstNameErorr: true});
    }
     else if (lastName == '') {
      this.setState({lastNameErorr: true});
    }
    else if (email == '') {
      this.setState({emailErorr: true, wrong: false, correct: false});
    }
     else if (pNum == '') {
      this.setState({pNumErorr: true});
    }
    else if (password == '') {
      this.setState({pwdErorr: true});
    } else if (confirmPassword == '') {
      this.setState({cPwdErorr: true});
    } else {
      let formdata = new FormData();
      formdata.append('name', firstName.toLowerCase());
      formdata.append('first_name', firstName.toLowerCase());
      formdata.append('last_name', lastName.toLowerCase());
      formdata.append('phone_number', pNum);
      formdata.append('email', email.toLowerCase());
      formdata.append('password', password);
      formdata.append('password_confirmation', confirmPassword);
      fetch('https://app.guessthatreceipt.com/api/user-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      })
        .then((response) => response.json())

        .then((data) => {
          if (data.status_code == 422) {
            this.setState({
              isloading: false,
              showErorr: data.message,
              isErorr: true,
            });
          } else {
            let loginData = new FormData();
            loginData.append('email', email.toLowerCase());
            loginData.append('password', password);
            fetch('https://app.guessthatreceipt.com/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: loginData,
            })
              .then((response) => response.json())
              .then((data) => {
                this.setState({
                  isloading: false,
                });
                  this.props.store_user(data.data);
                  this.props.navigation.navigate('Second',{pwd: password});
              })
              .catch((error) => {
                console.log(error)
                this.setState({isloading: false,showInvalidErorr: true});
              });
            
          }
        })
        .catch((error) => {
          this.setState({
            isloading: false,
            isErorr: true,
            showErorr: error.message,
          });
        });
    }
  }
  checkPassword(e) {
    const {password} = this.state;
    if (password === e) {
      this.setState({passwordConfirmed: true});
      this.setState({showPasswordNotMatch: false});
      this.setState({confirmPassword: e});
    } else {
      this.setState({showPasswordNotMatch: true});
      this.setState({passwordConfirmed: false});
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}} >
        
        <Image
          style={styles.backgroundImage}
          source={require('../../../assets/bg.png')}
        />
      
        <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1}}>
          <KeyboardAvoidingView enabled>
            {this.state.isErorr && (
              <View style={styles.showInvalidText}>
                <Image
                  style={{height: 40, width: 40}}
                  source={require('../../../assets/LargeInvalidIcon.png')}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 10,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: 'red',
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    {this.state.showErorr}
                  </Text>
                </View>
              </View>
            )}
            <View style={[styles.SectionStyle, {marginTop: 20}]}>
              <TextInput
                style={styles.inputStyle}
                placeholder="First Name"
                placeholderTextColor="#F6F6F7"
                autoCapitalize="sentences"
                returnKeyType="next"
                onChangeText={(text) => this.setState({firstName: text})}
                onFocus={() =>
                  this.setState({firstNameErorr: false, isloading: false})
                }
              />
              {this.state.firstNameErorr && (
                <View style={styles.touchableButton}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                </View>
              )}
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Last Name"
                placeholderTextColor="#F6F6F7"
                autoCapitalize="sentences"
                returnKeyType="next"
                onChangeText={(text) => this.setState({lastName: text})}
                onFocus={() => this.setState({lastNameErorr: false})}
              />
              {this.state.lastNameErorr && (
                <View style={styles.touchableButton}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                </View>
              )}
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter Email"
                placeholderTextColor="#F6F6F7"
                keyboardType="email-address"
                returnKeyType="next"
                onChangeText={(text) => this.validate(text)}
                onFocus={() =>
                  this.setState({emailErorr: false, isloading: false})
                }
              />
              <View style={styles.touchableButton} activeOpacity={0.8}>
                {this.state.wrong && (
                  <Image
                    source={require('../../../assets/wrong.png')}
                    style={styles.buttonImage}
                  />
                )}
                {this.state.correct && (
                  <Image
                    source={require('../../../assets/correct.png')}
                    style={styles.buttonImage}
                  />
                )}
                {this.state.emailErorr && (
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                )}
              </View>
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Phone Number"
                placeholderTextColor="#F6F6F7"
                keyboardType="numeric"
                onChangeText={(text) => this.setState({pNum: text})}
                onFocus={() => this.setState({pNumErorr: false})}
              />
              {this.state.pNumErorr && (
                <View style={styles.touchableButton}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                </View>
              )}
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                placeholderTextColor="#F6F6F7"
                secureTextEntry={this.state.hidePassword}
                returnKeyType="next"
                onChangeText={(e) => this.setState({password: e})}
                onFocus={() =>
                  this.setState({pwdErorr: false, isloading: false})
                }
              />
              <View style={[styles.touchableButton]}>
                {this.state.pwdErorr ? (
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 3,
                      height: 45,
                      width: 35,
                      justifyContent: 'center',
                      padding: 4,
                      alignItems: 'center',
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setPasswordVisibale();
                    }}>
                    <Image
                      source={
                        this.state.hidePassword
                          ? require('../../../assets/hide.png')
                          : require('../../../assets/view.png')
                      }
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Confirm Password"
                placeholderTextColor="#F6F6F7"
                secureTextEntry={this.state.hideConfirmPassword}
                returnKeyType="next"
                onChangeText={(e) => this.checkPassword(e)}
                onFocus={() =>
                  this.setState({cPwdErorr: false, isloading: false})
                }
              />
              <View style={[styles.touchableButton]}>
                {this.state.cPwdErorr ? (
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../../../assets/invalidIcon.png')}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 3,
                      height: 45,
                      width: 35,
                      justifyContent: 'center',
                      padding: 4,
                      alignItems: 'center',
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setConfirmPasswordVisibale();
                    }}>
                    <Image
                      source={
                        this.state.hideConfirmPassword
                          ? require('../../../assets/hide.png')
                          : require('../../../assets/view.png')
                      }
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {this.state.passwordConfirmed && (
              <View style={styles.showPasswordNotMatch}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Montserrat-Regular',
                  }}>
                  Password match
                </Text>
              </View>
            )}
            {this.state.showPasswordNotMatch && (
              <View style={styles.showPasswordNotMatch}>
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Montserrat-Regular',
                  }}>
                  Password does not match
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.buttonStyle, {marginTop: 10}]}
              activeOpacity={0.5}
              onPress={() => {
                this.moveToChooseImage();
              }}>
              {this.state.isloading ? (
                <ActivityIndicator size="large" color="#81b840" />
              ) : (
                <Text style={styles.buttonTextStyle}>NEXT</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.SignUpbuttonStyle]}
              activeOpacity={0.5}
              onPress={() => {
                this.moveToSignin();
              }}>
              <Text
                style={[
                  styles.buttonTextStyle,
                  {paddingTop: 25, color: 'white'},
                ]}>
                Sign in
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    // left: 0,
    // top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 45,
    width: '70%',
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    color: 'black',
    borderColor: '#7DE24E',
    height: 50,
    width: '70%',
    alignItems: 'center',
    borderRadius: 50,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  SignUpbuttonStyle: {
    width: 80,
    // backgroundColor: '#81b840',
    // borderWidth: 0,
    color: 'white',
    borderColor: '#7DE24E',
    height: 80,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#81b840',
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '70%',
    width: '70%',
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'white',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#a1ca70',
  },
  touchableButton: {
    position: 'absolute',
    right: 3,
    height: 45,
    width: 35,
    justifyContent: 'center',
    padding: 4,
    alignItems: 'center',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  showPasswordNotMatch: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '70%',
    marginLeft: 20,
  },
  showInvalidText: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
  },
});


const mapDispatchToProps = (dispatch) => {
  return {
    store_user: (user) => dispatch({type: 'SET_USER', payload: user}),
  };
};

export default connect(null, mapDispatchToProps)(SignupScreen);
