import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image,Text, Dimensions, ScrollView, ActivityIndicator,Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default function FilterAndSearch({ gallery, setFilteredGallery }) {
  


    const [filteredGallery, setFilteredGallery] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [areaFilter, setAreaFilter] = useState('All');
    const [cateOptions, setcateOption] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };
    

    const applyFilters = () => {
        let filteredData = [...gallery];

        // Apply category filter
        if (categoryFilter !== 'All') {
            filteredData = filteredData.filter(item => item.category_title === categoryFilter);
        }

        // Apply date filter
        if (selectedDate) {
            const selectedDateString = selectedDate.toISOString().split('T')[0]; // Extract date part
            console.log('selectedDateString',selectedDateString)
            filteredData = filteredData.filter(item => {
                const contentDateString = new Date(item.content_date).toISOString().split('T')[0]; // Extract date part
                console.log('contentDateString',contentDateString)
                return contentDateString === selectedDateString;
            });
            console.log('filteredData',filteredData)
        }

        // Apply area filter
        if (areaFilter !== 'All') {
            filteredData = filteredData.filter(item => item.area === areaFilter);
        }

        setFilteredGallery(filteredData);
    };


    return (
        <>
            <View style={styles.filtersContainer}>
            <Picker
             selectedValue={categoryFilter}
               onValueChange={(itemValue) => setCategoryFilter(itemValue)}
             style={{ height: 40, width: 150 }}
              >
            {cateOptions.map((item) => (
            <Picker.Item key={item.category_title} label={item.category_title} value={item.category_title} />
             ))}
           </Picker>

            <Picker
             selectedValue={areaFilter}
            onValueChange={(itemValue) => setAreaFilter(itemValue)}
            style={{ height: 40, width: 150 }}
            >
             {areaOptions.map((option) => (
             <Picker.Item key={option.value} label={option.label} value={option.value} />
             ))}
            </Picker>
                 <Button title="Select Date" onPress={showDatePicker} />
            
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
              <Button  title="Submit" onPress={applyFilters}></Button>
                {/* Add other filter components here */}
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 2
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    }
});
