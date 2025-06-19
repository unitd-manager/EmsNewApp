import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ShowImage = ({ visible, imageUrl, onClose }) => {
    console.log("imageUrl",imageUrl)
    return (
        <Modal visible={visible} transparent>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <FA size={25} color="#fff" name="times" />
                </TouchableOpacity>
                <Image
                    source={{ uri: `http://43.228.126.245/EMS-API2/storage/uploads/${imageUrl}`}}
                    style={{
                        height: deviceHeight / 1.5,
                        width: deviceWidth,
                        resizeMode: 'contain',
                    }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
});

export default ShowImage;

