import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image,Button, TextInput, StyleSheet, Alert,Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';
import { StackNav } from '../../../navigation/NavigationKeys';
import { useNavigation } from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';
import { Picker } from '@react-native-picker/picker';
import RazorpayCheckout from 'react-native-razorpay';
import imageBase from '../../../api/imageBase';


const ProductViewCart = ({ route }) => {
  const [cart, setCart] = useState([]);
  const [userContactId, setUserContactId] = useState(null);
  const [country, setCountry] = useState();

//   useEffect(() => {
//     const getUserCart = async () => {
//         try {
//             const userData = await AsyncStorage.getItem('USER');
//             const user = JSON.parse(userData);
            
//             setName({
//                 shipping_first_name: user?.first_name || '',
//                 shipping_email: user?.email || '',
//                 shipping_phone: user?.mobile || '',
//                 shipping_address1: user?.address1 || '',
//                 shipping_address_city:user?.address_city || '',
//                 shipping_address_state: user?.address_state || '',
//                 shipping_address_country_code:user?.address_country_code || '',
//                 shipping_address_po_code:user?.address_po_code || '',
//             });
//         } catch (error) {
//             console.error('Error fetching cart:', error);
//         }
//     };

//     getUserCart();
// }, []);


useEffect(() => {
  const getUserCart = async () => {
      try {
          const userData = await AsyncStorage.getItem('USER');
          const user = JSON.parse(userData);
          
          setUserContactId(user?.contact_id || null);
          api.post('/contact/getContactsById', { contact_id:user?.contact_id || null })
          .then((res) => {
              const contactCri = res.data.data
            

          setName({
              shipping_first_name: contactCri[0]?.first_name || '',
              shipping_email: contactCri[0]?.email || '',
              shipping_phone: contactCri[0]?.mobile || '',
              shipping_address1: contactCri[0]?.address1 || '',
              shipping_address_city:contactCri[0]?.address_city || '',
              shipping_address_state: contactCri[0]?.address_state || '',
              shipping_address_country_code:contactCri[0]?.address_country_code || '',
              shipping_address_po_code:contactCri[0]?.address_po_code || '',
          });
        })
      } catch (error) {
          console.error('Error fetching cart:', error);
      }
  };

  getUserCart();
}, []);

  const [name, setName] = useState({
    shipping_first_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address1: '',
    shipping_address_city: '',
    shipping_address_state: '',
    shipping_address_country_code: '',
    shipping_address_po_code: '',
  });
  const [showCart, setShowCart] = useState(true);
  const navigation = useNavigation();
  const getUserCart = async () => {
    try {
      const userData = await AsyncStorage.getItem('USER');
      const user = JSON.parse(userData);
      setUserContactId(user?.contact_id || null);
      if (user && user.contact_id) {
        const response = await api.post('/orders/getBasket', { contact_id: user.contact_id });
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  
  
  const BackToList = () => {
    navigation.navigate(StackNav.ProductList);
  };

  
  const updateQuantity = (index, newQuantity) => {
    const newCart = [...cart];
    newCart[index].qty = newQuantity;
    setCart(newCart);
  };

  const decrementQuantity = (index) => {
    const newQuantity = Math.max(0, cart[index].qty - 1);
    updateQuantity(index, newQuantity);
  };

  const incrementQuantity = (index) => {
    const newQuantity = cart[index].qty + 1;
    updateQuantity(index, newQuantity);
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.qty, 0).toFixed(2);
  };
  const checkout = () => {
    navigation.navigate(StackNav.PaymentSelect, { totalAmount: calculateTotal() });
  };


  const fetchCountry = () => {
    api.get('/content/getGeoCountry')
        .then((res) => {
            setCountry(res.data.data);
        })
        .catch((error) => {
            console.log('Error fetching data:', error);
        });
};
 
  const totalAmount = calculateTotal()
 
  const addDeliveryAddress = () => {
    // Validate fields
    if (!name.shipping_first_name.trim()) {
      Alert.alert('Please enter your first name.');
      return;
    }
    if (!name.shipping_email.trim()) {
      Alert.alert('Please enter your email.');
      return;
    }
    if (!name.shipping_phone.trim()) {
      Alert.alert('Please enter your phone number.');
      return;
    }
    if (!name.shipping_address1.trim()) {
      Alert.alert('Please enter your address.');
      return;
    }
  
    // Proceed with adding delivery address
    if (!userContactId) {
      Alert.alert('User information not found.');
      return;
    }
  
    api.post('/orders/insertorders', { ...name,
       cust_first_name: name.shipping_first_name,
       cust_email: name.shipping_email,
      cust_address1:name.shipping_address1,
      cust_address_city: name.shipping_address_city,
      cust_address_state:name.shipping_address_state,
      cust_address_country: name.shipping_address_country_code,
      cust_address_po_code: name.shipping_address_po_code,
      cust_phone:name.shipping_phone,
     contact_id: userContactId 
     ,payment_method:'online',
      amount:calculateTotal(),})
      .then(response => {
        if (response.status === 200) {
          const orderId = response.data.data.insertId;
          Promise.all(cart.map(item => {
            return api.post('/orders/insertOrderItem1', {
              qty: item.qty,
              unit_price: item.price,
              contact_id: userContactId,
              order_id:orderId,
              cost_price: item.qty * item.price,
                item_title: item.title,
                product_id: item.product_id,
            });
          }))
            .then(responses => {
              const allInserted = responses.every(response => response.status === 200);
              if (allInserted) {
                // Alert.alert('Order placed successfully');
                onPaymentPress();
              } else {
                console.error('Error placing one or more order items');
              }
            })
            .catch(error => {
              console.error('Error placing order items:', error);
            });
        } else {
          console.error('Error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  
  const colorfulAlert = (title, message, buttons) => {
    if (Platform.OS === 'ios') {
      Alert.alert(title, message, buttons);
    } else {
      Alert.alert(
        title,
        message,
        buttons,
        {
          cancelable: false,
          style: 'colorful' // Apply custom style
        }
      );
    }
  };
  const removeItem = (item) => {
    colorfulAlert(
      'Confirm Removal',
      'Are you sure you want to remove this item from the cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => remove(item),
          style: 'destructive' // Make the button red for emphasis
        },
      ]
    );
  };
 
  const remove = async item => {
    try {
      await api.post('/orders/deleteBasket', { basket_id: item.basket_id });
      await getUserCart();
      Alert.alert('Item removed from cart successfully');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  const removeBacket = async () => {
    try {
      await api.post('/orders/deleteBasketContact', { contact_id: userContactId });
      await getUserCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
   
  const SendEmail = () => {

    const to = name.shipping_email;
    const subject = "Order Confirmed";
    const phone = name.shipping_phone;
    const names = name.shipping_first_name;
    const address = name.shipping_address1;
    const city = name.shipping_address_city;
    const state = name.shipping_address_state;
    const Country = name.shipping_address_country_code;
    const TotalAmount = totalAmount;
    const code = name.shipping_address_po_code;

    api
        .post('/commonApi/sendUseremail', {
            to,
            subject,
            phone,
            names,
            address,
            city,
            state,
            Country,
            TotalAmount,
            code


        })
        .then(response => {
            if (response.status === 200) {
                // Alert.alert('Orders Sent successfully on your mail.');
                navigation.navigate(StackNav.ProductList)
            } else {
                console.error('Error');
            }
        });
};

useEffect(() => {
  getUserCart();
  fetchCountry();
}, []);
  const onPaymentPress = async () => {

    const amountInPaise = totalAmount * 100;
   
    const options = {
      description: 'Purchase Description',
      image: 'https://your-company.com/your_image.png',
      currency: 'INR',
      key: "rzp_test_yE3jJN90A3ObCp", // Replace with your Razorpay test/live key
      amount: amountInPaise, // Amount in currency subunits (e.g., 1000 for INR 10)
      name: 'United',
      prefill: {
        email:name.shipping_email,
        contact: name.shipping_phone,
        name: name.shipping_first_name,
      },
      theme: { color: '#532C6D' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      console.log('Payment Successful:', data);
      removeBacket()
      SendEmail()
    } catch (error) {
      console.error('Error:', error);
    }
  };



  

  return (
    <>
    
    <View style={styles.container}>
      {showCart ? (
        <>
          <Text style={styles.cartTitle}>View Cart</Text>
          <ScrollView>
            {cart.map((item, index) => (
              <View key={index} style={styles.cartItemContainer}>
                  <View style={styles.productImageContainer}>
                  { item.file_name !== null ?(
<Image source={{ uri:`${imageBase}${item.file_name}`}} style={styles.productImage} />
        ):(
          <Image source={require('../../../assets/images/2.png')} style={styles.productImage} />
        )}
                 {/* <Image source={{ uri:`http://43.228.126.245/EMS-API2/storage/uploads/${item.image}`}} style={styles.productImage} /> */}
              </View>
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemTitle}>{item.title}</Text>
                  <Text style={styles.cartItemPrice}>Price: Rs {item.price}</Text>
                  <Text style={styles.cartItemQuantity1}>Qty</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decrementQuantity(index)} style={styles.quantityButton}>
                      <Text style={styles.luxuryTitle1}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantityInput}
                      value={item.qty.toString()}
                      onChangeText={text => {
                        const newCart = [...cart];
                        newCart[index].qty = parseInt(text, 10) || 0;
                        setCart(newCart);
                      }}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => incrementQuantity(index)} style={styles.quantityButton}>
                      <Text style={styles.luxuryTitle1}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(item)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
          <Text style={styles.cartTotal}>Total: Rs</Text>
          <Text style={styles.cartTotal1}>{calculateTotal()}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setShowCart(false)} style={[styles.flipButton1, styles.backButton1]}>
              <Text style={styles.flipButtonText}>Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => BackToList()} style={styles.flipButton1}>
              <Text style={styles.flipButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.luxuryTitle}>Delivery Address</Text>
          <ScrollView>
            <Text style={styles.cartItemQuantity}>Name</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_first_name}
              onChangeText={text => setName({ ...name, shipping_first_name: text })}
              color='black'
              keyboardType="text"
            />
            <Text style={styles.cartItemQuantity}>Email</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_email}
              onChangeText={text => setName({ ...name, shipping_email: text })}
              color='black'
              keyboardType="email-address"
            />
            <Text style={styles.cartItemQuantity}>Phone</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_phone}
              onChangeText={text => setName({ ...name, shipping_phone: text })}
              color='black' 
              keyboardType="phone-pad"
            />
            <Text style={styles.cartItemQuantity}>Address</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_address1}
              onChangeText={text => setName({ ...name, shipping_address1: text })}
              color='black'
              keyboardType="default"
            />
            <Text style={styles.cartItemQuantity}>City</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_address_city}
              onChangeText={text => setName({ ...name, shipping_address_city: text })}
              color='black'
              keyboardType="default"
            />
            <Text style={styles.cartItemQuantity}>State</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_address_state}
              onChangeText={text => setName({ ...name, shipping_address_state: text })}
              color='black'
              keyboardType="default"
            />
            <Text style={styles.cartItemQuantity}>Country</Text>
             <View style={styles.pickerContainerCountry}>
             <Picker
             dropdownIconColor="blue"
              selectedValue={name.shipping_address_country_code}
              onValueChange={(itemValue, itemIndex) => setName({ ...name, shipping_address_country_code: itemValue })}
              
              style={styles.picker}
               >
              {country && country.map((item) => (
            //   <Picker.Item key={index} label={country.label} value={country.value} />
              <Picker.Item  key={item.country_code} label={item.name} value={item.country_code}style={styles.pickerItem} />
               ))}
             </Picker>
             </View>
            <Text style={styles.cartItemQuantity}>Code</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_address_po_code}
              color='black'
              onChangeText={text => setName({ ...name, shipping_address_po_code: text })}
              keyboardType="default"
            />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setShowCart(true)} style={styles.flipButton1}>
              <Text style={styles.flipButtonText}>View Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addDeliveryAddress()} style={[styles.flipButton1, styles.backButton1]}>
              <Text style={styles.flipButtonText}>Place Order</Text>
            </TouchableOpacity>
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Button title="Pay Now" onPress={onPaymentPress} />
            </View> */}
            <TouchableOpacity onPress={() => BackToList()} style={[styles.flipButton1, styles.backButton2]}>
              <Text style={styles.flipButtonText}>Shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#532C6D'
  },
  cartItemContainer: {
    alignItems: 'center',
    backgroundColor: '#D0DFD6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 7,
  },
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
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
    marginTop:15
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    color:'black',
    height: 33,
    borderColor: 'gray',
    borderWidth: 3,
    marginBottom: 16,
    paddingHorizontal: 12,
    width: 50,
  },
  quantityButton: {
    backgroundColor: '#532C6D',
    padding: 7,
    borderRadius: 3,
    marginHorizontal: 5,
    marginBottom:13
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color:'black'
  },
  cartItemPrice: {
    color: 'green',
    fontSize: 16,
    fontWeight:'bold',
    marginBottom: 4,
    marginLeft: 200,
  },
  // cartItemQuantity: {
  //   fontSize: 16,
  //   color: '#888',
  // },
  cartItemQuantity1: {
    fontSize: 16,
    color: '#532C6D',
    marginLeft:41
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flipButton1: {
    backgroundColor: '#52316C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  backButton1: {
    backgroundColor: 'green',
    marginLeft: 5,
  },
  backButton2: {
    backgroundColor: '#52316C',
    marginLeft: 5,
  },
  quantityInputs: {
    height: 45,
    borderColor: 'grey',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '95%',
    marginLeft:5,
    
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
    marginLeft: 220,
    marginTop: -50,
  },
  removeButtonText: {
    color: 'white',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:'black'

  },
  cartTotal1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginRight:245,
    color:'green'
  },
  flipButton: {
    backgroundColor: '#52316C',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  luxuryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:7,
    color:'black'

  },
  luxuryTitle1: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'white'
   
  },
  cartItemQuantity: {
    fontSize: 16,
    color: 'blue',
    marginLeft:7,
    marginTop:10
  },
  pickerContainerCountry: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 15,
    marginLeft:7,
    width: '94%',
    justifyContent: 'center',
},
pickerItem: {
  color: 'black',
  fontSize: 14,
  
},
picker: {
  height: 45,
  color:'black',
  width: '100%',
  borderWidth: 1,
  borderColor: 'gray',
},
});

export default ProductViewCart;
