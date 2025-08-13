import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {getHeight} from '../../../common/constants';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import RadioButton from './RadioButton';
import EText from '../../../components/common/EText';
import HTML from 'react-native-render-html';
import ShowResult from './ShowResult';
import EButton from '../../../components/common/EButton';
import {useSelector} from 'react-redux';
import {StackNav} from '../../../navigation/NavigationKeys';

const stripHtmlTags = htmlString => {
  return htmlString ? (
    <HTML source={{html: htmlString}} contentWidth={200} />
  ) : null;
};

const Quiz = ({navigation}) => {
  const PAGE_SIZE = 5;
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [answerDetails, setAnswerDetails] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [user, setUserData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedQuestionIds, setLoadedQuestionIds] = useState(new Set());
  const colors = useSelector(state => state.theme.theme);

  const onPressBack = () => {
    navigation.navigate(StackNav.Login);
  };

  const questionIndex = clients.length;
  console.log('questionIndex', questionIndex);
  // console.log('answerResult', answerResult);

  const openModal = url => {
    // setSelectedImageUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // setSelectedImageUrl(null);
  };

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  const contactId = user ? user.contact_id : null;
  const contactName = user ? user.first_name : null;

  useEffect(() => {
    getUser();
  }, [contactId]);

  console.log('contactId', contactId);
  console.log('contactName', contactName);

  const Reset = () => {
    api
      .post('/content/deleteAnswerReset', {
        contact_id: contactId,
      })
      .then(res => {
        if (res && res.data.msg === 'Success') {
          Alert.alert('successfully Reset ');
        }
      });
  };

  useEffect(() => {
    api
      .get('/content/getQuestion', {
        params: {
          page: currentPage,
          pageSize: PAGE_SIZE,
        },
      })
      .then(res => {
        const promises = res.data.data.map(element => {
          // Check if the question ID is already loaded
          if (!loadedQuestionIds.has(element.question_id)) {
            loadedQuestionIds.add(element.question_id);
            element.tag = String(element.tag).split(',');
            return api
              .post('/content/getAnswersByQuestionId', {
                question_id: element.question_id,
              })
              .then(res => res.data.data);
          }
          return Promise.resolve(null);
        });

        Promise.all(promises)
          .then(answers => {
            const newClients = res.data.data.filter(
              (_, index) => answers[index],
            );
            setClients(prevClients => [...prevClients, ...newClients]);
            setAnswerDetails(prevAnswers => [
              ...prevAnswers,
              ...answers.filter(Boolean),
            ]);
          })
          .catch(error => {
            console.log('Error fetching answers:', error);
          });
      })
      .catch(() => {
        console.log('Error fetching questions');
      });
  }, [currentPage]);

  const loadMoreQuestions = () => {
    // Check if all questions have been loaded
    const totalQuestions = clients.length;
    const totalPossiblePages = Math.ceil(totalQuestions / PAGE_SIZE);

    if (currentPage < totalPossiblePages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleCheckboxChange = (questionId, answerId, status) => {
    setCheckedItems({
      ...checkedItems,
      [questionId]: answerId,
    });

    api
      .post('/content/getAnswerHistory', {question_id: questionId})
      .then(res => {
        console.log('status', res.data.data);
        if (res.data.data !== undefined) {
          const contactAnswerId = res.data.data.contact_answer_id;
          console.log('contactAnswerId', contactAnswerId);
          api.post('/content/deleteAnswerHistory', {
            contact_answer_id: contactAnswerId,
          });

          const registerData = {
            question_id: questionId,
            answer_id: answerId,
            status: status,
            contact_id: contactId,
            contact_name: contactName,
          };
          console.log('registerData', registerData);
          api
            .post('/content/insertContactAnswer', registerData)
            .then(response => {
              if (response.status === 200) {
                //  Alert.alert('Your answer is successfully registered');
              } else {
                console.error('Error');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } else {
          const registerData = {
            question_id: questionId,
            answer_id: answerId,
            status: status,
            contact_id: contactId,
            contact_name: contactName,
          };
          console.log('registerData', registerData);
          api
            .post('/content/insertContactAnswer', registerData)
            .then(response => {
              if (response.status === 200) {
                // Alert.alert('You have successfully registered');
              } else {
                console.error('Error');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      });
  };
  console.log('currentPage', currentPage);
  console.log('clients', clients.length);
  console.log('checkedItemslength', checkedItems.length);
  console.log('checkedItems', checkedItems);
  const len = Object.keys(checkedItems).length;
  console.log('len', len);
  const renderItem = ({item, index}) => {
    const isChecked = checkedItems[item.question_id] || null;
    const answers = answerDetails[index] || [];

    return contactId ? (
      <View style={localStyles.container}>
        <View style={localStyles.itemContainer}>
          <LinearGradient
            style={localStyles.item}
            colors={['#fff', '#fff']}
            start={{x: 0, y: 0.2}}
            end={{x: 1.5, y: 0.2}}>
            <View style={localStyles.questionRow}>
              <Text style={localStyles.indexNum}>{index + 1}.</Text>
              <Text style={localStyles.title}>{item.questions}</Text>
            </View>

            {answers.map(answer => (
              <RadioButton
                key={answer.answer_id}
                isChecked={isChecked === answer.answer_id}
                label={stripHtmlTags(answer.description)}
                onSelect={() =>
                  handleCheckboxChange(
                    item.question_id,
                    answer.answer_id,
                    answer.status,
                  )
                }
                textColor="black"
              />
            ))}
          </LinearGradient>
        </View>
      </View>
    ) : (
      <Text></Text>
    );
  };
  return (
    <>
      <EHeader title="Quiz" />
      {contactId !== null && (
        <Text style={localStyles.title1}>
          (If you check all answers your result will be showing)
        </Text>
      )}
      {contactId === null && (
        <EText
          type={'b24'}
          marginTop={200}
          marginLeft={50}
          color={colors.dark ? 'blue' : 'blue'}>
          {strings.seeTheQuiz}
        </EText>
      )}
      {contactId === null && (
        <TouchableOpacity
          onPress={onPressBack}
          style={localStyles.signUpContainer}>
          <EText
            type={'b22'}
            marginTop={10}
            color={colors.dark ? 'red' : 'red'}>
            {strings.plsLoginFirst}
          </EText>
        </TouchableOpacity>
      )}
      <SafeAreaView style={localStyles.container}>
        <FlatList
          data={clients.slice(0, currentPage * PAGE_SIZE)}
          renderItem={renderItem}
          keyExtractor={item => item.question_id}
          contentContainerStyle={{paddingBottom: 120}}
          onEndReached={loadMoreQuestions}
          onEndReachedThreshold={0.1}
        />
        <View style={localStyles.btnContainer}>
          <TouchableOpacity style={localStyles.signBtnContainer}>
            {parseFloat(clients?.length) === parseFloat(len) && (
              <EButton
                onPress={() => openModal()}
                title={strings.ShowYourResult}
                type={'S16'}
                containerStyle={{borderRadius: 10}}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.signBtnContainer}>
            {parseFloat(clients?.length) === parseFloat(len) && (
              <EButton
                onPress={() => Reset()}
                title={strings.Reset}
                type={'S16'}
                bgColor={'#532C6D'}
                containerStyle={{borderRadius: 10}}
              />
            )}
          </TouchableOpacity>
        </View>
        {modalVisible && (
          <ShowResult
            visible={modalVisible}
            resultData={contactId}
            questionIndex={questionIndex}
            onClose={closeModal}
          />
        )}
        {contactId !== null && (
          <View style={localStyles.pageNumberContainer}>
            <Text style={localStyles.pageNumberText}>
              Page {currentPage} of {Math.ceil(clients.length / PAGE_SIZE)}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingHorizontal: 20, // optional instead of mh20
    marginBottom: '10%', // instead of mb10
  },
  signBtnContainer: {
    height: getHeight(50),
    borderRadius: 0,
    width: '48%', // small adjustment to prevent overflow
  },

  pageNumberContainer: {
    ...styles.center,
    marginTop: 10,
  },
  pageNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#532c6d',
  },
  itemContainer: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowOpacity: 0.8,
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },

  item: {
    height: 260,
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#532c6d',
    marginBottom: 10,
  },
  title1: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#532c6d',
    marginBottom: 10,
    marginTop: 10,
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'red',
    marginBottom: -300,
    marginTop: 300,
  },
  title3: {
    fontSize: 23,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'blue',
    marginBottom: -300,
    marginTop: 300,
    marginLeft: 70,
  },
  indexNum: {
    fontWeight: '700',
    color: '#532c6d',
  },
  questionRow: {
    flexDirection: 'row',
  },
});
export default Quiz;
