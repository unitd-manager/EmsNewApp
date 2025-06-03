import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';

// Local Imports
import {TabRoute} from '../NavigationRoutes';
import {TabNav} from '../NavigationKeys';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import EText from '../../components/common/EText';
import {
  ExploreActive,
  ExploreUnActive,
  FavouriteActive,
  FavouriteUnActive,
  HomeActive,
  HomeUnActive,
  ProfileActive,
  ProfileUnActive,
  TicketActive,
  TicketUnActive,
} from '../../assets/svgs';

export default function TabBarNavigation() {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const TabText = memo(({IconType, label, focused}) => (
    <View style={localStyle.tabViewContainer}>
      {IconType}
      <EText
        style={styles.mt5}
        numberOfLines={1}
        color={focused ? colors.textColor : colors.grayScale5}
        type={'R14'}>
        {label}
      </EText>
    </View>
  ));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          localStyle.tabBarStyle,
          {backgroundColor: colors.backgroundColor},
        ],
        tabBarShowLabel: false,
      }}
      initialRouteName={TabNav.HomeTab}>
      <Tab.Screen
        name={TabNav.HomeTab}
        component={TabRoute.HomeTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <HomeActive /> : <HomeUnActive />}
              focused={focused}
              label={strings.home}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.ExploreTab}
        component={TabRoute.ExploreTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <ExploreActive /> : <ExploreUnActive />}
              focused={focused}
              label={strings.explore}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.FavoritesTab}
        component={TabRoute.FavoritesTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <FavouriteActive /> : <FavouriteUnActive />}
              focused={focused}
              label={strings.favorites}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.TicketsTab}
        component={TabRoute.TicketsTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <TicketActive /> : <TicketUnActive />}
              focused={focused}
              label={strings.tickets}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.ProfileTab}
        component={TabRoute.ProfileTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <ProfileActive /> : <ProfileUnActive />}
              focused={focused}
              label={strings.profile}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    height: getHeight(60),
    ...styles.ph20,
    borderTopWidth: 0,
  },
  tabViewContainer: {
    ...styles.center,
  },
});
