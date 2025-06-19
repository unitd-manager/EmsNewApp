import React, { useState, useEffect } from 'react';
import { Modal, Image, View, Alert, Text, TouchableOpacity, TextInput,ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNav } from '../../../navigation/NavigationKeys';
import HTMLView from 'react-native-htmlview';
import { useNavigation } from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';

const ProductAddCart = ({ route }) => {



    const price = route.params.item.price;
    const title = route.params.item.title;
    const image = route.params.item.file_name;
    const productIds = route.params.item.product_id;
    const particulars = route.params.item.description_short;
    const Language = route.params.item.product_language;

    const author = route.params.item.author_name;

  



  // if (!item) {
  //   return null;
  // }

  const [user, setUserData] = useState();
  const [quantity, setQuantity] = useState('1');
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  const contactId = user ? user.contact_id : null;

  useEffect(() => {
    getUser();
  }, [contactId]);

  const onPressSignIn = () => {
    navigation.navigate(StackNav.Login);
  };

  
    
  const calculateTotal = () => {
    return (price * quantity).toFixed(2);
  };

 
  const addToCart = () => {
    if (contactId !== null) {
    
      const productId = productIds;
      const itemprice = price;

      api.post('/orders/getBasket', { contact_id: contactId })
        .then(res => {
          setCart(res.data.data);
        });

      const registerData = {
        product_id: productIds,
        contact_id: contactId,
        unit_price: itemprice,
        qty: quantity,

      };

      api.post('/orders/insertbasketAddCart', registerData)
        .then(response => {
          if (response.status === 200) {
            navigation.navigate(StackNav.ProductViewCart);
          } else {
            console.error('Error');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      Alert.alert(
        'Please Login',
        'You need to log in to add items to the cart.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: onPressSignIn,
          },
        ]
      );
    }
  };

  return (
    <>
    <EHeader title={route.params ? route.name : route.name} />
    <ScrollView>
    <View style={styles.modalContent}>
      {/* <TouchableOpacity style={styles.closeButton} onPress={() => onDismiss(!isVisible)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity> */}
      <View style={styles.productImageContainer}>
      { image !== null ?(
          <Image source={{ uri:`http://43.228.126.245/EMS-API2/storage/uploads/${image}`}} style={styles.productImage} />
        ):(
          <Image source={require('../../../assets/images/2.png')} style={styles.productImage} />
        )}
      {/* <Image source={{ uri:`http://43.228.126.245/EMS-API2/storage/uploads/${image}`}} style={styles.productImage} /> */}
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{title}</Text>
        <View  style={styles.productDetails1}>
        <Text style={styles.authorName1}> Author :</Text>
        <Text style={styles.authorName}>   {author}</Text>
        </View>
        <View  style={styles.productDetails2}>
        <Text style={styles.authorName2}> Language :</Text>
        <Text style={styles.authorName}>   {Language}</Text>
        </View>
        <View style={styles.modalContent1}>
        
        <Text style={styles.productQty}> Qty:</Text>
        <TextInput
          style={styles.quantityInput}
          value={quantity}
          onChangeText={(text) => setQuantity(text)}
          keyboardType="numeric"
        ></TextInput>
        <Text style={styles.productPrice}>Rs{price.toFixed(2)}</Text>
         {/* <Text>Total: ${calculateTotal()}</Text> */}
    </View>

        
      </View>
      
    </View>
    <View style={styles.modalContent2}>
    <Text style={styles.productParticularsHead}>Description</Text>
    <HTMLView
     value={particulars} // Pass the HTML content via the 'value' prop
     stylesheet={styles.productParticulars} // Apply custom styles if needed
     addLineBreaks={true} // Add line breaks for better readability
     />
    {/* <HTMLView style={styles.productParticulars}>{particulars}</HTMLView> */}
    </View>
    </ScrollView>
    <View style={styles.buttonContainer}>
     
     <TouchableOpacity onPress={() => addToCart({ ...route, quantity: parseInt(quantity, 10) })} style={styles.addToCartButton}>
     <Text style={styles.addToCartButtonText}>Add to Cart</Text>
     </TouchableOpacity>
     <Text style={styles.total1}>Total: Rs</Text>
     <Text style={styles.total}> {calculateTotal()}</Text>
     </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#D0DFD6',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent2: {
    // backgroundColor: '#D0DFD6',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // productImage: {
  //   width: 360,
  //   height: 260,
  //   borderRadius: 8,
  //   marginTop: 30,
  //   marginBottom: 16,
  // },
  productImageContainer: {
    width: 200,
    height: 260,
    borderRadius: 15,
    marginRight: 16,
    backgroundColor: '#fff', // Set the background color here
    justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  },
  productImage: {
    width: '95%',
    height: '95%',
    borderRadius: 15,
  },
  productDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productDetails1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 16,
  },
  productDetails2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black'
  },
  productParticulars: {
    color:'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'green',
    marginBottom: 8,
    marginRight:41
  },
  total1: {
    color:'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginRight:0
  },
  productParticularsHead: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft:-260,
    color:'brown'
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft:-5,
    color:'#532C6D'
  },
  authorName1: {
    color:'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    marginLeft:-5,
    
  },
  authorName2: {
    color:'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft:-105,
    
  },
  productPrice: {
    fontSize: 20,
    color: 'green',
    marginLeft:160
  },
  productQty: {
    fontSize: 18,
    color: 'black',
    marginLeft:10,
    marginBottom:-5
  },
  quantityInput: {
    color:'black',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: -5,
    paddingHorizontal: 8,
    width: 50,
    marginLeft:5
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft:38,
    marginBottom:10
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:18
  }
});

export default ProductAddCart;
