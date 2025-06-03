import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';
import PlayAudio from '../../../components/common/PlayAudio';

const ListScreen = () => {
    const navigation = useNavigation()
   
    return (

        <SafeAreaView style={styles.container}>
            <EHeader title="Audio Gallery" onPress={() => navigation.pop()} />
            <PlayAudio />           
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Feedcontainer: {
        marginHorizontal: 10,
    },
});

export default ListScreen;
