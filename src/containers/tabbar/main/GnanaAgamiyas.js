import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import AD from 'react-native-vector-icons/AntDesign';
import AboutCategoryDetail from './AboutCategoryDetail';
import AboutSubCategoryDetail from './AboutSubCategoryDetail';

const ListFlat = () => {
  const route = useRoute();
  const [manitha, setManitha] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailview, setDetailView] = useState(false);
  const [detailviewSub, setDetailViewSub] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemSub, setSelectedItemSub] = useState([]);

  useEffect(() => {
    api.post('/category/getSectionsCategory', { section_id:route.params.item.section_id })
      .then((res) => {
        setManitha(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching categories:', error);
      });
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const promises = manitha.map(async category => {
          const response = await api.post('/subcategory/getSubCategoryByCategoryId', { category_id: category.category_id });
          return response.data.data;
        });
        const subCategories = await Promise.all(promises);
        setSelectedItems(subCategories.flat());
      } catch (error) {
        console.log('Error fetching sub-categories:', error);
      }
    };

    fetchSubCategories();
  }, [manitha]);

  const handleItemPress = (id) => {
    api.post('/content/getDetailContent', { section_id: route.params.item.section_id, category_id: id })
      .then((res) => {
        setSelectedItem(res.data.data);
        setDetailView(true);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };

  const handleItemSub = (id) => {
    api.post('/content/getSubContent', { sub_category_id: id })
      .then((res) => {
        setSelectedItemSub(res.data.data);
        setDetailViewSub(true);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };

  const onDismiss = async () => {
    setDetailView(false);
  }
  const onDismissSub = async () => {
    setDetailViewSub(false);
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <LinearGradient
            style={styles.item}
            colors={['#fff', '#fff']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1.5, y: 0.2 }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleItemPress(item.category_id)}>
                <AD style={styles.arrowIcon} name="rightcircle" size={22} color="#532c6d" />
                <Text style={styles.categoryTitle}>{item.category_title}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedItems.map(subItem => {
                if (subItem.category_id === item.category_id) {
                 
                  return (
                    
                    <TouchableOpacity key={subItem.sub_category_id} style={styles.subItem} onPress={() => {handleItemSub(subItem.sub_category_id); console.log('SubId',subItem.sub_category_id)}}>
                      
                      <AD style={styles.subArrowIcon} name="rightcircle" size={18} color="#532c6d" />
                      <Text style={styles.subCategoryTitle}>{subItem.sub_category_title}</Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </LinearGradient>
        </View>
        <AboutCategoryDetail detailview={detailview} setDetailView={setDetailView} singleDetail={selectedItem} onDismiss={onDismiss}></AboutCategoryDetail>
        <AboutSubCategoryDetail detailviewSub={detailviewSub} setDetailViewSub={setDetailViewSub} selectedItemSub={selectedItemSub} onDismissSub={onDismissSub}></AboutSubCategoryDetail>
      </View>
    );
  };

  return (
    <>
       <EHeader title={route.params.item.section_title} />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={manitha}
          renderItem={renderItem}
          keyExtractor={(item) => item.category_id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  item: {
    borderRadius: 8,
    padding: 20,
    height:270,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowIcon: {
    marginRight: 10,
    marginTop:10
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft:30,
    marginTop:-25
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft:20
  },
  subArrowIcon: {
    marginRight: 10,
  },
  subCategoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default ListFlat;
