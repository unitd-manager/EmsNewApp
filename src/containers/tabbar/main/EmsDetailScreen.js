import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, StatusBar, Image } from 'react-native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';

const EmsDetailScreen = ({ route }) => {
  const { subCategoryMenu } = route.params;
  const [firstCompanyDetails, setFirstCompanyDetails] = useState(null);

  const editClientsById = (id) => {
    api
      .post('/content/getSubContent', { sub_category_id: id })
      .then((res) => {
        setFirstCompanyDetails(res.data.data[0]);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };

  useEffect(() => {
    editClientsById(subCategoryMenu);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <EHeader title={route.params.item.section_title} />
      <View style={styles.content}>
        <SafeAreaView style={styles.safeAreaContainer}>
          {firstCompanyDetails && (
            <View style={styles.header}>
              <Image source={{ uri: firstCompanyDetails.image }} style={styles.image} />
              <Text style={styles.title}>{firstCompanyDetails.title}</Text>
            </View>
          )}
          {firstCompanyDetails && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{firstCompanyDetails.description}</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  safeAreaContainer: {
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3498db', // Text color
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black', // Text color
  },
});

export default EmsDetailScreen;
