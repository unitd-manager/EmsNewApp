// ProductList.js
import React, { useState,useEffect } from 'react';
import { View, FlatList, Text, Image,Alert, StyleSheet,TextInput, TouchableOpacity,ScrollView,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import { useNavigation } from '@react-navigation/native';
import imageBase from '../../../api/imageBase';
import { StackNav } from '../../../navigation/NavigationKeys';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const areaOptions = [
  { label: 'Option 1', value: 'Option1' },
  { label: 'Option 2', value: 'Option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
  { label: 'Option 6', value: 'option6' },
  { label: 'Option 7', value: 'option7' },
  { label: 'Option 8', value: 'option8' },
  // Add other options here
];


const ProductList = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUserData] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const [categoryFilter, setCategoryFilter] = useState('All');
    const [areaFilter, setAreaFilter] = useState('All');
    const [cateOptions, setcateOption] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [valuelistCountry, setValuelistCountry] = useState([]);

    

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const showDatePickerTo = () => {
        setDatePickerVisibilityTo(true);
    };

    const hideDatePickerTo = () => {
        setDatePickerVisibilityTo(false);
    };

    const handleConfirm = (date) => {
      
            setFromDate(date);
       
        hideDatePicker();
    };
    const handleConfirmTo = (date) => {

       
            setToDate(date);
        
            hideDatePickerTo();
    };
  

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  const contactId = user ? user.contact_id : null;


  useEffect(() => {
    getUser();
  }, [contactId]);

 

  useEffect(() => {
    api
      .get('/product/getProductBookList')
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
    }, []);

    useEffect(() => {
      api
          .post('/orders/getBasket', { contact_id: contactId })
          .then(res => {
            setCart(res.data.data);
          })
          .catch(error => {
            console.error('Error getting basket:', error);
          });
      }, []);
  
      const fetchGalleryCatecory = () => {
        api.get('/content/getPhotoCategory')
            .then((res) => {
                setcateOption(res.data.data);
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
            });
    };
   
    const getValuelistCountry = () => {
        api
          .get('/product/getProductBookCato')
          .then((res) => {
            setValuelistCountry(res.data.data);
          })
          .catch((error) => {
            console.log('valuelist not found:', error);
          });
      };

    const addToCart = (product, qty) => {
     
      if (contactId !== null) {
        // Proceed with adding to cart
      
        const productId = product.product_id;
        const itemprice = product.price;
    
    
        api
          .post('/orders/getBasket', { contact_id: contactId })
          .then(res => {
            setCart(res.data.data);
          })
          .catch(error => {
            console.error('Error getting basket:', error);
          });
    
        const registerData = {
          product_id: productId,
          contact_id: contactId,
          unit_price: itemprice,
        };
      
        api
          .post('/orders/insertbasketAddCart', registerData)
          .then(response => {
            if (response.status === 200) {
              // Cart item added successfully
            } else {
              console.error('Error adding item to cart');
            }
          })
          .catch(error => {
            console.error('Error adding item to cart:', error);
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
    
const removeItem = (item) => {
 
  api.post('/orders/deleteBasket', {
    basket_id: item.basket_id,
  });
  Alert.alert('remove the cart')
};

const onPressSignIn = () => {
  navigation.navigate(StackNav.Login);
};
const onPressViewCart = () => {
  navigation.navigate(StackNav.ProductViewCart);
};

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
  };


  const applyFilters = () => {
    let filteredData = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'All') {
        filteredData = filteredData.filter(item => item.category_title === categoryFilter);
    }

    // Apply area filter
    if (areaFilter !== 'All') {
        filteredData = filteredData.filter(item => item.category_title === areaFilter);
    }

    // Apply date filter if selected
    if (fromDate && toDate) {
        filteredData = filteredData.filter(item => {
            const contentDate = new Date(item.content_date);
            return contentDate >= fromDate && contentDate <= toDate;
        });
    }

   // Apply search filter
   if (searchQuery !== '') {
    filteredData = filteredData.filter(item =>
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.author_name && item.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
}


    return filteredData;
};
  const checkout = () => {
    // Placeholder for integrating with a real payment gateway
    alert(`Total: $${calculateTotal()}\nPayment Successful!`);
    setCart([]);
  };
   
  useEffect(() => {
    fetchGalleryCatecory();
    getValuelistCountry();
}, []);
const filteredGallery = applyFilters();

  return (
    <>
    <EHeader title={route.params ? route.name : route.name} />

    <View style={styles.filtersContainer}>
           <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={areaFilter}
                    dropdownIconColor="#52316C"
                    onValueChange={(itemValue) => setAreaFilter(itemValue)}
                    style={styles.picker}
                >
                   <Picker.Item label=" Book Catogery" value="All" style={styles.pickerItem}/>
                    {valuelistCountry.map((item) => (
                        <Picker.Item key={item.category_title} label={item.category_title} value={item.category_title} style={styles.pickerItem}/>
                    ))}
                </Picker>
                </View>
                <TouchableOpacity onPress={onPressViewCart} style={styles.addToCartButton}>
               <Text style={styles.addToCartButtonText}>View Cart</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                

                <DateTimePickerModal
                isVisible={isDatePickerVisibleTo}
                mode="date"
                onConfirm={handleConfirmTo}
                onCancel={hideDatePickerTo}
                />
            </View>
            
            {/* <View style={styles.filtersContainerDate}>
          
            <TouchableOpacity onPress={showDatePicker} style={[styles.textContainer, { width: '32%' }]}>
                <Text style={styles.textColor}>{fromDate ? fromDate.toDateString() : 'From date'}</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={showDatePickerTo} style={[styles.textContainer1, { width: '32%' }]}>
                <Text style={styles.textColor}>{toDate ? toDate.toDateString() : 'To date'}</Text>
            </TouchableOpacity>
            </View> */}
            {toDate !== null || areaFilter !== 'All' ? (
    <TouchableOpacity onPress={() => {setFromDate(null), setToDate(null), setAreaFilter('All')}} style={styles.clearButtonContainer}>
        <Text style={styles.clearButtonText}>Clear</Text>
    </TouchableOpacity>
        ) : null}


        <TextInput
            style={styles.searchInput}
            placeholder=" Search..."
            placeholderTextColor="black"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
         />

    <View style={styles.container}>
       
      <FlatList
  data={filteredGallery}
  keyExtractor={(item) => item.product_id} // Assuming product_id is unique
  renderItem={({ item }) => (
    <View style={styles.productContainer}>
      {/* Product Image - NOT clickable */}
      <View style={styles.productImageContainer}>
        {item.image !== null ? (
          <Image
            source={{ uri: `${imageBase}${item.file_name}` }}
            style={styles.productImage}
          />
        ) : (
          <Image
            source={require('../../../assets/images/2.png')}
            style={styles.productImage}
          />
        )}
      </View>
  
      {/* Product Details - Title is clickable */}
      <View style={styles.productDetails}>
        <TouchableOpacity
          onPress={() => {
            setSelectedProduct(item);
            navigation.navigate(StackNav.ProductAddCart, { item });
          }}
        >
          <Text  style={styles.productName}>{item.title}</Text>
        </TouchableOpacity>
  
        <View  numberOfLines={2} ellipsizeMode="tail"style={styles.productDetails1}>
          <Text style={styles.authorName1}>Author:</Text>
          <Text style={styles.authorName}>{item.author_name}</Text>
        </View>
  
        <Text style={styles.productPrice}>Rs : {item.price ? item.price.toFixed(2) : 'N/A'}</Text>
      </View>
    </View>
  )}
  
/>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D0DFD6',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  productDetails1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
     marginBottom: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  authorName1: {
    color:'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft:-30,
    
  },
  productImageContainer: {
    width: 100,
    height: 125,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#fff', // Set the background color here
    justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  },
  productImage: {
    width: '95%',
    height: '95%',
    borderRadius: 8,
  },
  
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop:10,
    color:'black'
  },
  authorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color:'#532C6D',
    marginTop:10
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop:20,
    marginLeft:100
  },
  addToCartButton: {
    height:40,
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 8,
    marginRight:10
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight:'bold'
  },
  cartContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    fontSize: 14,
    marginBottom: 50,
    marginLeft:10
  },
  cartItem1: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft:10
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemDetails: {
    marginLeft: 16,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cartItemPrice: {
    fontSize: 14,
    color: 'green',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
  },
 removeButtonText: {
    color: 'white',
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: -10,
    },
    filtersContainerDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       alignItems: 'center',
        padding: -1,
    },
    // pickerItem: {
    //     color: 'black', 
    //     fontSize:20
    // },
   
    textColor: {
        color:'white',
        fontSize:13,
       marginLeft:7,
       
        
      },
      textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#52316C',
        padding: 6,
        marginLeft:10,
        borderRadius: 5,
        marginRight:10
      
      },
      textContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#52316C',
        borderRadius: 5,
        padding: 6,
        marginRight:130
      },
    clearButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginLeft:315
    },
    clearButtonText: {
        color: 'red',
        textDecorationLine: 'underline',
    },
    searchInput: {
        height: 40,
        borderColor: '#D0DFD6',
        borderWidth: 3,
        margin: 10,
        borderRadius: 8,
        paddingLeft: 10,
    },
   
    pickerContainer: {
        borderColor: '#D0DFD6',
        borderWidth: 3,
        borderRadius: 3,
        marginVertical: 10,
        marginLeft:10,
        width: 190,
        borderRadius: 8,
        height:40,
        justifyContent: 'center',
      },
      picker: {
   
        borderWidth: 1,
        borderColor: 'gray',
        color:'black',   
        fontSize:14
        
      },
      pickerItem: {
        color: 'black', 
        fontSize:13
    },
});

export default ProductList;
