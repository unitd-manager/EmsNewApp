import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome5';
import HTML from 'react-native-render-html';
import api from '../../../api/api';
import Modal, {ModalProps} from 'react-native-modal';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const stripHtmlTags = htmlString => {
  return htmlString ? (
    <HTML source={{html: htmlString}} contentWidth={200} />
  ) : null;
};

const ShowResult = ({visible, resultData, questionIndex, onClose}) => {
  const [answerResult, setAnswerResult] = useState([]);

  useEffect(() => {
    api
      .post('/content/getAnswerResult', {contact_id: resultData})
      .then(res => {
        setAnswerResult(res.data.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);
  console.log('answerResult', answerResult);

  const renderItem = ({item, index}) => {
    const isEvenIndex = index % 2 === 0;
    const itemBackgroundColor = isEvenIndex ? 'white' : 'white';
    const textColor = isEvenIndex ? 'black' : 'black';

    return (
      <View style={[styles.item, {backgroundColor: itemBackgroundColor}]}>
        <View style={styles.itemContent}>
          <Text
            style={[
              styles.title,
              {color: textColor},
              itemBackgroundColor && styles.titleShadow,
            ]}>
            {item.questions}
          </Text>
          <Text
            style={[
              styles.title,
              {color: textColor, flexDirection: 'row'},
              itemBackgroundColor,
            ]}>
            Answer
          </Text>

          {item.description && (
            <Text
              style={[
                styles.title,
                {color: textColor, flexDirection: 'row'},
                itemBackgroundColor && styles.titleShadow,
              ]}>
              {stripHtmlTags(item.description)}
            </Text>
          )}
          <Text
            style={[
              styles.title,
              {color: textColor, flexDirection: 'row'},
              itemBackgroundColor,
            ]}>
            Result
          </Text>
          {item.status && (
            <Text
              style={[
                styles.title,
                {color: textColor},
                itemBackgroundColor && styles.titleShadow,
              ]}>
              {stripHtmlTags(item.status)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={1}
      animationOutTiming={1}
      backdropOpacity={0.7}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FA size={25} color="#fff" name="times" />
        </TouchableOpacity>
        <Text style={[styles.title1, {color: 'white'}, styles.titleShadow]}>
          Question: {questionIndex}/ currect Answer : {answerResult.length}
        </Text>

        <FlatList
          data={answerResult}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.question_id}-${index}`} // Use a unique key
          numColumns={1}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  item: {
    marginVertical: 20,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 8,
  },
  itemContent: {
    //   flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  questionText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ShowResult;
