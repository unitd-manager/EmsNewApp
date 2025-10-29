import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNav} from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RazorpayCheckout from 'react-native-razorpay';

const Yaseeni = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
  // Add more countries as needed
];
const bloodGroup = [
  {label: 'A+', value: 'A+'},
  {label: 'A-', value: 'A-'},
  {label: 'B+', value: 'B+'},
  {label: 'B-', value: 'B-'},
  {label: 'O+', value: 'O+'},
  {label: 'O-', value: 'O-'},
  {label: 'AB+', value: 'AB+'},
  {label: 'AB-', value: 'AB-'},
  // Add more countries as needed
];

const countries = [
  {label: 'United States', value: 'US'},
  {label: 'Canada', value: 'CA'},
  // Add more countries as needed
];

const PhotoGallery = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [userContactId, setUserContactId] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState();
  const [cateOptions, setcateOption] = useState([]);
  setSubscription;
  const [paymentOptions, setPaymentOptions] = useState();
  const [subscription, setSubscription] = useState();
  const [country, setCountry] = useState();
  const [amount, setAmount] = useState(0);
  const [gender, setGender] = useState();
  const [qualification, setQualification] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBaiyath, setDateOfBaiyath] = useState('');
  const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);

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

  // Function to handle date selection
  const handleConfirm = date => {
    // Format the selected date as needed (e.g., "MM/DD/YYYY")
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const formattedDate = date.toLocaleDateString('en-GB', options);
    setDateOfBirth(formattedDate);
    hideDatePicker();
  };
  const handleConfirmTo = date => {
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const formattedDate = date.toLocaleDateString('en-GB', options);
    setDateOfBaiyath(formattedDate);

    hideDatePickerTo();
  };

  const openModal = url => {
    setSelectedImageUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUrl(null);
  };

  const BackToList = () => {
    navigation.navigate(StackNav.HomeTab);
  }; 

  const fetchGallery = () => {
    setLoading(true);
    api
      .get('/content/getPhotoGallery')
      .then(res => {
        setGallery(res.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchGalleryCatecory = () => {
    api
      .get('/content/getValueListPayment')
      .then(res => {
        setcateOption(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  const fetchGenderq = () => {
    api
      .get('/valuelist/getGenderValuelist')
      .then(res => {
        setGender(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };
  const fetchCountry = () => {
    api
      .get('/content/getGeoCountry')
      .then(res => {
        setCountry(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  const fetchQualification = () => {
    api
      .get('/valuelist/getQualificationValuelist')
      .then(res => {
        setQualification(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };
  const fetchGender = () => {
    api
      .get('/content/getGeoCountry')
      .then(res => {
        setCountry(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  const fetchGalleryCatecorySpcl = () => {
    api
      .post('/content/getValueListSpecialPaymentId', {value: categoryFilter})
      .then(res => {
       
        setPaymentOptions(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };

  let totalAmount = '';

  // Check if any object in the cateOptions array has a code property
  const hasCodeProperty = paymentOptions;

  if (hasCodeProperty?.code === null) {
    totalAmount = amount.discount;
  } else {
    totalAmount = hasCodeProperty?.code; // Or any other default value
  }

  
  useEffect(() => {
    const getUserCart = async () => {
      try {
        const userData = await AsyncStorage.getItem('USER');
        const user = JSON.parse(userData);

        // if (!user?.contact_id) {
        //   Alert.alert('Please Login');
        //   navigation.navigate(StackNav.Login);
        //   return;
        // }
        // setUserContactId(user?.contact_id || null);
        api
          .post('/contact/getContactsById', {
            contact_id: user?.contact_id || null,
          })
          .then(res => {
            const contactCri = res.data.data;
             console.log('contact_id',contactCri[0].contact_id)
             console.log('subs_payment_status',contactCri[0].subs_payment_status)
            setUserContactId(contactCri[0].contact_id)
            setDateOfBirth(contactCri[0].date_of_birth);
            setDateOfBaiyath(contactCri[0].date_of_baiyath);
            setName({
              shipping_first_name: contactCri[0]?.first_name || '',
              shipping_email: contactCri[0]?.email || '',
              shipping_phone: contactCri[0]?.mobile || '',
              shipping_address1: contactCri[0]?.address1 || '',
              shipping_address_city: contactCri[0]?.address_city || '',
              shipping_address_state: contactCri[0]?.address_state || '',
              shipping_address_country_code:
                contactCri[0]?.address_country_code || '',
              shipping_address_po_code: contactCri[0]?.address_po_code || '',
              date_of_birth: contactCri[0]?.date_of_birth || '',
              father_name: contactCri[0]?.father_name || '',
              date_of_baiyath: contactCri[0]?.date_of_baiyath || '',
              gender: contactCri[0]?.gender || '',
              alternate_number: contactCri[0]?.alternate_number || '',
              qualification: contactCri[0]?.qualification || '',
              ug_specialization: contactCri[0]?.ug_specialization || '',
              pg_specialization: contactCri[0]?.pg_specialization || '',
              blood_group: contactCri[0]?.blood_group || '',
              yaseeni: contactCri[0]?.yaseeni || '',
            });
          });
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    getUserCart();
  }, []);

  const SendEmail = () => {
    const to = name.shipping_email;
    const subject = 'Payment Confirmed';
    const names = name.shipping_first_name;
    const TotalAmount = totalAmount;
    const Type = categoryFilter;
    const phone = name.shipping_phone;
    const address = name.shipping_address1;
    const city = name.shipping_address_city;
    const state = name.shipping_address_state;
    const Country = name.shipping_address_country_code;
    const code = name.shipping_address_po_code;

    api
      .post('/commonApi/sendUseremailPayment', {
        to,
        subject,
        names,
        TotalAmount,
        Type,
        address,
        city,
        state,
        Country,
        phone,
        code,
      })
      .then(response => {
        if (response.status === 200) {
          Alert.alert('Payment successfully,check your email for acknowledgement.');
          navigation.navigate(StackNav.HomeTab);
        } else {
          console.error('Error');
        }
      });
  };

  
  const [name, setName] = useState({
    shipping_first_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address1: '',
    shipping_address_city: '',
    shipping_address_state: '',
    shipping_address_country_code: '',
    shipping_address_po_code: '',
     date_of_birth: '',
    father_name: '',
    pass_word: '',
    date_of_baiyath: '',
    gender: '',
    alternate_number: '',
    qualification: '',
    ug_specialization: '',
    pg_specialization: '',
    blood_group: '',
    yaseeni: '',
  });

  const addDeliveryAddress = () => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    // Proceed with adding delivery address
    api
        .post('/orders/insertorders', {...name, contact_id: userContactId})
        .then(response => {
          
            if (response.status === 200) {
                const orderId = response.data.data.insertId;
                const contactUser = {
                    address1: name?.shipping_address1,
                    address_city: name?.shipping_address_city,
                    contact_id: userContactId,
                    address_state: name?.shipping_address_state,
                    address_country_code: name?.shipping_address_country_code,
                    address_po_code: name?.shipping_address_po_code,
                    subscribe: 1,
                };
                const contactUserInsert = {
                    first_name: name?.shipping_first_name,
                    email: name?.shipping_email,
                    address1: name?.shipping_address1,
                    address_city: name?.shipping_address_city,
                    address_state: name?.shipping_address_state,
                    address_country_code: name?.shipping_address_country_code,
                    address_po_code: name?.shipping_address_po_code,
                    published:1,
                    date_of_birth: dateOfBirth,
                    mobile: name?.shipping_phone,
                    father_name: name?.father_name,
                    date_of_baiyath: dateOfBaiyath,
                    gender: name?.gender,
                    pass_word: name?.pass_word,
                    alternate_number: name?.alternate_number,
                    qualification: name?.qualification,
                    ug_specialization: name?.ug_specialization,
                    pg_specialization: name?.pg_specialization,
                    blood_group: name?.blood_group,
                    yaseeni: name?.yaseeni,
                };
                const contactUserInsertMagazine = {
                    first_name: name?.shipping_first_name,
                    email: name?.shipping_email,
                    address1: name?.shipping_address1,
                    address_city: name?.shipping_address_city,
                    address_state: name?.shipping_address_state,
                    address_country_code: name?.shipping_address_country_code,
                    address_po_code: name?.shipping_address_po_code,
                    payment_date: currentDate,
                    subs_payment_status: 'subscribe',
                    subscribe: 1,
                    published:1,
                    date_of_birth: dateOfBirth,
                    pass_word: name?.pass_word,
                    mobile: name?.shipping_phone,
                    father_name: name?.father_name,
                    date_of_baiyath: dateOfBaiyath,
                    gender: name?.gender,
                    alternate_number: name?.alternate_number,
                    qualification: name?.qualification,
                    ug_specialization: name?.ug_specialization,
                    pg_specialization: name?.pg_specialization,
                    blood_group: name?.blood_group,
                    yaseeni: name?.yaseeni,
                };
                if ( userContactId) {
                  categoryFilter === 'Magazine payment' ? api.post('/contact/editContactPaymentMagazine', {
                    address1: name?.shipping_address1,
                    address_city: name?.shipping_address_city,
                    contact_id: userContactId,
                    address_state: name?.shipping_address_state,
                    address_country_code: name?.shipping_address_country_code,
                    address_po_code: name?.shipping_address_po_code,
                    payment_date: currentDate,
                    subs_payment_status: 'subscribe',
                    subscribe: 1,
                    date_of_birth: dateOfBirth,
                    father_name: name?.father_name,
                    date_of_baiyath: dateOfBaiyath,
                    gender: name?.gender,
                    alternate_number: name?.alternate_number,
                    qualification: name?.qualification,
                    ug_specialization: name?.ug_specialization,
                    pg_specialization: name?.pg_specialization,
                    blood_group: name?.blood_group,
                    yaseeni: name?.yaseeni,
                }): ''
                } else {
                  categoryFilter === 'Magazine payment' ? api.post('/contact/insertContact', contactUserInsertMagazine):''
                }
                return Promise.all([
                    api.post('/orders/insertOrderItem', {
                        item_title: categoryFilter,
                        unit_price: totalAmount,
                        contact_id: userContactId,
                        order_id: orderId,
                    }),
                    
                    userContactId ? api.post('/contact/editContactPayment', contactUser) :
                    categoryFilter !== 'Magazine payment' ? api.post('/contact/insertContact', contactUserInsert):
                     
                    categoryFilter === 'Magazine payment' ? api.post('/content/insertMagazineReg', {
                        payment_date: currentDate,
                        amount: totalAmount,
                        contact_id: userContactId,
                        subs_payment_status: 'subscribe'
                    }) : null
                ]);
            } else {
                console.error('Error');
            }
        })
        .then(([paymentResponse]) => {
            if (paymentResponse && paymentResponse.status === 200) {
                // Address added successfully, proceed with payment
                SendEmail();
            } else {
                console.error('Error adding address');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

  const onPaymentPress = async () => {

    if (!categoryFilter) {
        Alert.alert('Please Select Payment Method.');
        return;
      }
    
    if (!totalAmount) {
        Alert.alert('Please enter Amount.');
        return;
      }

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
    const amountInPaise = totalAmount * 100;
    console.log('amountInPaise', amountInPaise);
    const options = {
      description: 'Purchase Description',
      image: 'https://your-company.com/your_image.png',
      currency: 'INR',
      key: 'rzp_test_yE3jJN90A3ObCp', // Replace with your Razorpay test/live key
      amount: amountInPaise, // Amount in currency subunits (e.g., 1000 for INR 10)
      name: 'United',
      prefill: {
        email: name.shipping_email,
        contact: name.shipping_phone,
        name: name.shipping_first_name,
      },
      theme: {color: '#532C6D'},
    };

    try {
      const data = await RazorpayCheckout.open(options);
      console.log('Payment Successful:', data);
      addDeliveryAddress();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    fetchGallery();
    fetchGalleryCatecory();
    fetchCountry();
    fetchGender();
    fetchGenderq();
    fetchQualification();
    fetchGalleryCatecorySpcl(categoryFilter);
  }, [categoryFilter]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {/* <EHeader title="Payment" /> */}
      <View style={styles.buttonContainer1}>
        <View style={styles.pickerContainer5}>
          <Text style={styles.cartItemQuantity7}>Payment</Text>
        </View>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#163a71" />
        </View>
      )}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersContainer1}>
          {/* <Text  style={styles.filtersText}>Payment Method</Text> */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryFilter}
              onValueChange={itemValue => setCategoryFilter(itemValue)}
              dropdownIconColor="blue"
              style={styles.picker}>
              <Picker.Item
                label="Select method"
                value=""
                style={styles.pickerItem}
              />
              {cateOptions.map(item => (
                <Picker.Item
                  key={item.value}
                  label={item.value}
                  value={item.value}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
        <Text style={styles.cartItemQuantity11}>Amount</Text>
        {paymentOptions?.code ? (
          <TextInput
            style={styles.quantityInputs1}
            value={paymentOptions.code}
            onChangeText={text =>
              setPaymentOptions({...paymentOptions.code, discount: text})
            }
            editable={false}
            color="black"
            keyboardType="text"
          />
        ) : (
          <TextInput
            style={styles.quantityInputs1}
            value={amount.discount}
            onChangeText={text => setAmount({...amount, discount: text})}
            color="black"
            keyboardType="text"
          />
        )}
      </View>

  <ScrollView 
    style={{flex: 1}} 
    contentContainerStyle={{paddingBottom: 120}} 
    showsVerticalScrollIndicator={true}
    keyboardShouldPersistTaps="handled"
  >
        {userContactId ? (
          <>
            <Text style={styles.cartItemQuantity}>Name</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_first_name}
              onChangeText={text =>
                setName({...name, shipping_first_name: text})
              }
              editable={false}
              color="black"
              keyboardType="text"
            />
            <Text style={styles.cartItemQuantity}>Email</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_email}
              onChangeText={text => setName({...name, shipping_email: text})}
              editable={false}
              color="black"
              keyboardType="email-address"
            />
            <Text style={styles.cartItemQuantity}>Phone</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_phone}
              onChangeText={text => setName({...name, shipping_phone: text})}
              editable={false}
              color="black"
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <>
            <Text style={styles.cartItemQuantity}>Name</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_first_name}
              onChangeText={text =>
                setName({...name, shipping_first_name: text})
              }
              color="black"
              keyboardType="text"
            />
            <Text style={styles.cartItemQuantity}>Email</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_email}
              onChangeText={text => setName({...name, shipping_email: text})}
              color="black"
              keyboardType="email-address"
            />
            <Text style={styles.cartItemQuantity}>Phone</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.shipping_phone}
              onChangeText={text => setName({...name, shipping_phone: text})}
              color="black"
              keyboardType="phone-pad"
            />
          </>
        )}
{!userContactId && (
  <>
         <Text style={styles.cartItemQuantity}>Password</Text>
            <TextInput
              style={styles.quantityInputs}
              value={name.pass_word}
              onChangeText={text => setName({...name, pass_word: text})}
              color="black"
              keyboardType="phone-pad"
            />
            </>
)}
{categoryFilter === 'Magazine payment' && (
  <>
        <Text style={styles.cartItemQuantity}>Alternate Number</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.alternate_number}
          onChangeText={text => setName({...name, alternate_number: text})}
          color="black"
          keyboardType="default"
        />
        <Text style={styles.cartItemQuantity4}>Date of Birth</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.pickerContainer}>
            {/* Date of Birth */}
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {dateOfBirth ? dateOfBirth : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {/* Date picker modal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <Text style={styles.cartItemQuantity3}>Date of Baiyath</Text>
          <View style={styles.pickerContainer1}>
            {/* Date of Birth */}

            <TouchableOpacity onPress={showDatePickerTo}>
              <Text style={styles.dateText}>
                {dateOfBaiyath ? dateOfBaiyath : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {/* Date picker modal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisibleTo}
              mode="date"
              onConfirm={handleConfirmTo}
              onCancel={hideDatePickerTo}
            />
          </View>
        </View>
        <Text style={styles.cartItemQuantity4}>Gender</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              dropdownIconColor="blue"
              selectedValue={name.gender}
              onValueChange={(itemValue, itemIndex) =>
                setName({...name, gender: itemValue})
              }
              style={styles.picker}>
              {gender &&
                gender.map(item => (
                  <Picker.Item
                    key={item.value}
                    label={item.value}
                    value={item.value}
                    style={styles.pickerItem}
                  />
                ))}
            </Picker>
          </View>
          <Text style={styles.cartItemQuantity1}>Are you a Yaseeni?</Text>
          <View style={styles.pickerContainer1}>
            <Picker
              dropdownIconColor="blue"
              selectedValue={name.yaseeni}
              onValueChange={(itemValue, itemIndex) =>
                setName({...name, yaseeni: itemValue})
              }
              style={styles.picker}>
              {Yaseeni &&
                Yaseeni.map(item => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    style={styles.pickerItem}
                  />
                ))}
            </Picker>
          </View>
        </View>
        <Text style={styles.cartItemQuantity}>Father Name</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.father_name}
          onChangeText={text => setName({...name, father_name: text})}
          color="black"
          keyboardType="default"
        />
        <Text style={styles.cartItemQuantity4}>Blood Group</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              dropdownIconColor="blue"
              selectedValue={name.blood_group}
              onValueChange={(itemValue, itemIndex) =>
                setName({...name, blood_group: itemValue})
              }
              style={styles.picker}>
              {bloodGroup &&
                bloodGroup.map(item => (
                  <Picker.Item
                    key={item.value}
                    label={item.value}
                    value={item.value}
                    style={styles.pickerItem}
                  />
                ))}
            </Picker>
          </View>
          <Text style={styles.cartItemQuantity2}>Qualification</Text>
          <View style={styles.pickerContainer1}>
            <Picker
              dropdownIconColor="blue"
              selectedValue={name.qualification}
              onValueChange={(itemValue, itemIndex) =>
                setName({...name, qualification: itemValue})
              }
              style={styles.picker}>
              {qualification &&
                qualification.map(item => (
                  <Picker.Item
                    key={item.value}
                    label={item.value}
                    value={item.value}
                    style={styles.pickerItem}
                  />
                ))}
            </Picker>
          </View>
        </View>
        </>
        )}
        <Text style={styles.cartItemQuantity}>Address</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.shipping_address1}
          onChangeText={text => setName({...name, shipping_address1: text})}
          color="black"
          keyboardType="default"
        />
        <Text style={styles.cartItemQuantity}>City</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.shipping_address_city}
          onChangeText={text => setName({...name, shipping_address_city: text})}
          color="black"
          keyboardType="default"
        />
        <Text style={styles.cartItemQuantity}>State</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.shipping_address_state}
          onChangeText={text =>
            setName({...name, shipping_address_state: text})
          }
          color="black"
          keyboardType="default"
        />
        <Text style={styles.cartItemQuantity}>Country</Text>
        <View style={styles.pickerContainerCountry}>
          <Picker
            dropdownIconColor="blue"
            selectedValue={name.shipping_address_country_code}
            onValueChange={(itemValue, itemIndex) =>
              setName({...name, shipping_address_country_code: itemValue})
            }
            style={styles.picker}>
            {country &&
              country.map(item => (
                <Picker.Item
                  key={item.country_code}
                  label={item.name}
                  value={item.country_code}
                  style={styles.pickerItem}
                />
              ))}
          </Picker>
        </View>
        <Text style={styles.cartItemQuantity}>Code</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.shipping_address_po_code}
          onChangeText={text =>
            setName({...name, shipping_address_po_code: text})
          }
          color="black"
          keyboardType="default"
        />
       {categoryFilter === 'Magazine payment' && (
  <>
    <Text style={styles.cartItemQuantity}>UG Specialization</Text>
    <TextInput
      style={styles.quantityInputs}
      value={name.ug_specialization}
      onChangeText={text => setName({...name, ug_specialization: text})}
      color="black"
      keyboardType="default"
    />
      <Text style={styles.cartItemQuantity}>PG Specialization</Text>
        <TextInput
          style={styles.quantityInputs}
          value={name.pg_specialization}
          onChangeText={text => setName({...name, pg_specialization: text})}
          color="black"
          keyboardType="default"
        />
         </>
        )}
  </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => BackToList()}
          style={[styles.flipButton1, styles.backButton1]}>
          <Text style={styles.flipButtonText}>Go Back</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={() => onPaymentPress()}
          style={[styles.flipButton1, styles.backButton1]}>
          <Text style={styles.flipButtonText}> Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PhotoGallery;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  pickerContainer5: {
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 8,
    marginVertical: 10,
    marginLeft: 15,
    width: 170,
    height: 50,
    justifyContent: 'center',
  },
  cartItemQuantity4: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 18,
    marginTop: 10,
  },
  cartItemQuantity2: {
    fontSize: 16,
    color: 'blue',
    marginRight: -100,
    marginTop: -95,
  },
  pickerContainer10: {
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 8,
    marginVertical: 10,
    marginRight: 25,
    width: 170,
    height: 50,
    justifyContent: 'center',
  },
  galleryContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
    marginTop:3
  },
  cartItemQuantity3: {
    fontSize: 16,
    color: 'blue',
    marginRight: -125,
    marginTop: -95,
  },
  pickerContainer1: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginRight: 25,
    width: 170,
    height: 50,
    justifyContent: 'center',
  },
  filtersContainer1: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
    marginBottom: 10,
  },
  filtersText: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1,
    marginTop: 28,
    marginRight: 20,
    color: 'blue',
  },
  dateText: {
    fontSize: 14,
    padding: 10,
    // borderColor: '#ccc',
    color: 'black',
    // borderWidth: 1,
    // borderRadius: 5,
  },
  filtersContainerDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: -1,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#52316C',
    padding: 7,
    marginLeft: 5,
    marginBottom: 7,
  },
  textContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#52316C',
    padding: 7,
    marginRight: 130,
    marginBottom: 7,
  },
  // cartItemQuantity1: {
  //     fontSize: 16,
  //     marginBottom: 8,
  //   },
  picker: {
    height: 50,
    color: 'black',
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
  },
  cartItemQuantity11: {
    fontSize: 16,
    color: 'blue',
    marginRight: 7,
    marginTop: -13,
  },
  clearButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 315,
  },
  // pickerItem: {
  //     color: 'black',
  //     fontSize:17
  // },
  clearButtonText: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
  },
  textColor: {
    color: 'white',
  },
  cartItemQuantity: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 18,
    marginTop: 10,
  },
  cartItemQuantity1: {
    fontSize: 16,
    color: 'blue',
    marginRight: -147,
    marginTop: -95,
  },
  quantityInputs: {
    height: 50,
    borderColor: 'grey',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '90%',
    marginLeft: 18,
  },
  quantityInputs1: {
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 1,
    paddingHorizontal: 8,
    width: 80,
    marginLeft: -10,
    marginTop: -7,
    marginRight: 18,
  },
  cartItemQuantity7: {
    fontSize: 30,
    color: 'brown',
    marginLeft: 2,
    marginTop: -5,
    textDecorationLine: 'underline',
  },
  pickerContainer5: {
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 8,
    marginVertical: 10,
    marginLeft: 15,
    width: 170,
    height: 50,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginLeft: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer1: {
    marginTop: 1,
    marginLeft: 7,
    marginBottom:-15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flipButton1: {
    backgroundColor: '#52316C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginLeft: 15,
    width: 170,
    height: 50,
    justifyContent: 'center',
  },
  pickerContainerCountry: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 15,
    marginLeft: 15,
    width: '90%',
  },
  // picker: {
  //     height: 40,
  //     width: '100%',
  // },
  pickerItem: {
    color: 'black',
    fontSize: 14,
  },
});
