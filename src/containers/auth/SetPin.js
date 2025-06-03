// Library import
import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';

// Local import
import ESafeAreaView from '../../components/common/ESafeAreaView';
import EHeader from '../../components/common/EHeader';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import {StackNav, TabNav} from '../../navigation/NavigationKeys';
import EButton from '../../components/common/EButton';
import typography from '../../themes/typography';
import SuccessModal from '../../components/models/SuccessModal';
import {
  OrderModalDark,
  OrderModalLight,
  WalletModalDark,
  WalletModalLight,
} from '../../assets/svgs';
import {walletData} from '../../api/constant';

const SetPin = ({navigation, route}) => {
  const colors = useSelector(state => state.theme.theme);
  const title = route.params?.title;
  const isWallet = route.params?.isWallet;
  const [pin, setPin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const isPaymentModal = colors.dark ? (
    <OrderModalDark style={styles.selfCenter} />
  ) : (
    <OrderModalLight style={styles.selfCenter} />
  );

  const isOrderModal = colors.dark ? (
    <WalletModalDark style={styles.selfCenter} />
  ) : (
    <WalletModalLight style={styles.selfCenter} />
  );

  const onPressModalClose = () => setModalVisible(false);

  const onPinChange = code => setPin(code);
  const onPressPinContinue = () => {
    if (!!title) {
      setModalVisible(true);
    } else {
      navigation.navigate(StackNav.SetSecure);
    }
  };

  const onPressERiceipt = () => {
    setModalVisible(false);
    navigation.navigate(StackNav.ETicket, {item: walletData[3]});
  };

  const onPressViewOrder = () => {
    setModalVisible(false);
    navigation.navigate(TabNav.FavoritesTab);
  };

  const onPressETicket = () => {
    setModalVisible(false);
    navigation.navigate(StackNav.ETicket);
  };

  return (
    <ESafeAreaView>
      <EHeader title={!!title ? title : strings.createNewPin} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          <EText type={'r18'} align={'center'}>
            {!!title ? strings.enterPINPayment : strings.pinDesc}
          </EText>
          <OTPInputView
            pinCount={4}
            code={pin}
            onCodeChanged={onPinChange}
            autoFocusOnLoad={false}
            codeInputFieldStyle={[
              localStyles.pinInputStyle,
              {
                color: colors.textColor,
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
              },
            ]}
            codeInputHighlightStyle={{
              borderColor: colors.primary5,
              backgroundColor: colors.inputFocusColor,
            }}
            style={localStyles.inputStyle}
            secureTextEntry={true}
          />
        </View>
        <EButton
          type={'S16'}
          title={strings.continue}
          color={colors.white}
          onPress={onPressPinContinue}
          containerStyle={localStyles.btnContainerStyle}
        />
        <SuccessModal
          visible={modalVisible}
          onPressModalClose={onPressModalClose}
          itemImage={isWallet ? isPaymentModal : isOrderModal}
          headerTitle={
            isWallet ? strings.orderSuccessful : strings.congratulations
          }
          subTitle={isWallet ? strings.orderDesc : strings.topUpDesc}
          btnText1={isWallet ? strings.viewOrder : strings.viewETicket}
          btnText2={isWallet ? strings.viewEReceipt : strings.cancel}
          onPressBtn1={isWallet ? onPressViewOrder : onPressETicket}
          onPressBtn2={isWallet ? onPressERiceipt : onPressModalClose}
        />
      </KeyBoardAvoidWrapper>
    </ESafeAreaView>
  );
};

export default SetPin;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph30,
    ...styles.justifyCenter,
    ...styles.flex,
  },
  pinInputStyle: {
    height: getHeight(60),
    width: moderateScale(75),
    borderRadius: moderateScale(15),
    ...typography.fontSizes.f36,
    ...typography.fontWeights.SemiBold,
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mb10,
  },
  inputStyle: {
    height: getHeight(60),
    ...styles.mv30,
  },
});
