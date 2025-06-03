import React from 'react';
import { View, Button } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const Razerpays = ({ totalAmount }) => {
  console.log('totalAmount:', totalAmount);
  // Convert totalAmount to paise
  const amountInPaise = totalAmount * 100;
  console.log('amountInPaise',amountInPaise)

  const onPaymentPress = async () => {
    const options = {
      description: 'Purchase Description',
      image: 'https://your-company.com/your_image.png',
      currency: 'INR',
      key: "rzp_test_yE3jJN90A3ObCp", // Replace with your Razorpay test/live key
      amount: '100', // Amount in currency subunits (e.g., 1000 for INR 10)
      name: 'United',
      prefill: {
        email: 'test@example.com',
        contact: '1234567890',
        name: 'Test User',
      },
      theme: { color: '#F37254' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      console.log('Payment Successful:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pay Now" onPress={onPaymentPress} />
    </View>
  );
};

export default Razerpays;
