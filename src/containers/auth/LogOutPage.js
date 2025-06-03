import React, { createRef, useState,useEffect } from 'react';
import { ImageBackground, TouchableOpacity, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from "react-native-restart"
import EHeader from '../../components/common/EHeader';
import { styles } from '../../themes';
import images from '../../assets/images';
import EText from '../../components/common/EText';
import strings from '../../i18n/strings';
import EButton from '../../components/common/EButton';
import SuccessModal from '../../components/models/SuccessModal';
import LogOut from '../../components/models/LogOut';
import { moderateScale } from '../../common/constants';
import { StackNav } from '../../navigation/NavigationKeys';
import AuthContext, {defaultState, reducer, restoreToken} from '../../navigation/Type/Auth';
//import Auth from '../../navigation/Type/Auth';
import Login from './Login';

export default function ScanFace({ navigation,user }) {
  const route = useRoute();
  const colors = useSelector(state => state.theme.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  const onPressModalClose = () => setModalVisible(false);
  const [users, setUserData] = useState();
  const LogOutSheetRef = createRef();
  const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();

  const onPressSkip = () => navigation.navigate(StackNav.Quiz);
  const onPressBack = () => { 
    navigation.navigate(StackNav.HomeTab);
  };

  console.log('user',user)
  console.log('user1',route?.params?.user)

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    console.log('userdata',userData)
    setUserData(userData);
  };

  const contactId = users ? users.contact_id : null;
  const contactName = users ? users.first_name : null;
  console.log('contactId',contactId)
  useEffect(() => {
    getUser();
  }, []);
  React.useEffect(() => {
    restoreToken(dispatch).then(() => {
      AsyncStorage.getItem('USER', (err, MobileNumber) => {
        let data=JSON.parse(MobileNumber)
        setUserData(data)
        console.log('mobno', MobileNumber)
      })
    })
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: data => {
        if(data){
          setUserData(data)
        }
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: () => {  
        AsyncStorage.clear();
        setUserData(''); 
        try {
           RNRestart.Restart(); // Attempt to restart the application
        } catch (error) {
          console.error('Error restarting the application:', error);
        }
      },
      signUp: data => {
        dispatch({type: 'SIGN_IN', token: data});
      },
    }),
    [],
  );
  
  if (state.isLoading) {
    return null;
  }

  return (
    <>
      {/*?<EHeader /> */}
      <AuthContext.Provider value={authContext}>
      {users && users.contact_id ? (
      <View style={localStyles.root}>
        <View>
          <TouchableOpacity
            onPress={onPressLogOutBtn}
            style={[
              localStyles.notificationContainer,
              { borderColor: colors.dark ? colors.grayScale8 : colors.grayScale3 },
            ]}>
            <Ionicons
              
              name={'log-out-outline'}
              size={moderateScale(200)}
              color={colors.redColor}
              style={{ backgroundColor: colors.backgroundColor, padding: 5, borderRadius: 50 }}
            />
            <EText type={'r30'} color={colors.redColor} style={{ marginLeft: 115, }}>
                Logout
              </EText>
          </TouchableOpacity>
          <LogOut SheetRef={LogOutSheetRef} navigation={navigation} />
        </View>
        <TouchableOpacity
                onPress={onPressBack}
                style={localStyles.signUpContainer}>
                <EText
                  type={'b16'}
                  color={colors.dark ? 'blue' : 'blue'}>
                  {strings.BackToHome}
                </EText>
              </TouchableOpacity>
        <EText type={'r16'} color={colors.primary5}  style={{ marginLeft: 170,marginBottom:10 }}>
                Or   
              </EText>
          <EButton
            title={strings.Quiz}
            type={'S18'}
            color='white'
            containerStyle={localStyles.skipBtnContainer}
            bgColor={'green'}
            onPress={onPressSkip}
          />
      </View>
      ) : (
        <Login></Login>
    
      )}
      </AuthContext.Provider>
    </>
  );
  
}

const localStyles = StyleSheet.create({
  imgStyle: {
    ...styles.flex,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  root: {
    ...styles.flex,
    ...styles.justifyBetween,
    paddingHorizontal: 20,
  },
  notificationContainer: {
    borderWidth: 1,
    padding: 20,
    borderRadius:70,
    marginBottom: 20,
    marginTop:100
  },
  btnContainer: {
    ...styles.mb10,
    ...styles.rowSpaceAround,
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
  skipBtnContainer: {
    width: '100%',
    marginBottom:200
  },
});
