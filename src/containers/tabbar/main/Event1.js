import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import api from '../../../api/api';
import AboutCategoryDetail from './AboutCategoryDetail';
import EHeader from '../../../components/common/EHeader';

const ListFlat = () => {
  const route = useRoute();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [detailview, setDetailView] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState();

  const handleItemPress = (id) => {
    api
      .post('/content/getSubContent', { sub_category_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };

  const onDismiss = async () => {
    setDetailView(false);
  }

  useEffect(() => {
    setLoading(true);
    api
      .post('/category/getSectionsCategoryAboutUs', { section_id: route.params.item.section_id })
      .then((res) => {
        res.data.data.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });
        setClients(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });

  }, []);

  return (

    <>
      <EHeader title={route.params.item.section_title} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {loading ? (
              <ActivityIndicator></ActivityIndicator>
            ) : (
              <FlatList
                data={clients}
                horizontal={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <Pressable
                    style={{
                      width: (Dimensions.get('screen').width - 50) / 2,
                      margin: 5,
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      padding: 15,
                      marginBottom: 10
                    }}
                    onPress={() => {
                      handleItemPress(item.category_id)
                      setDetailView(true);
                    }}>
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `http://43.228.126.245/EMS-API/storage/uploads/${item.file_name}`,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#000',
                          marginTop: 10,
                        }}>
                        {item.category_title}
                      </Text>
                    </View>
                  </Pressable>
                )}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </ScrollView>
        <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryDetail>
      </View>
    </>

  );
};

export default ListFlat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  tinyLogo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
    alignSelf: 'center',
  },
});
