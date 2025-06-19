import { Text, View, ScrollView, Image,Linking,TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';
import MI from 'react-native-vector-icons/MaterialIcons';

export default function AboutCategoryDetail({ detailviewSub, onDismissSub, selectedItemSub, setDetailViewSub }) {
  
  // hide space and set image in about description 
  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name === 'img') {
      let { src, width, height } = node.attribs;
      width = Number(width) || 300;
      height = Number(height) || 300;

      if (src.startsWith('https://emsmedia.net')) {
        src = src.replace('https://emsmedia.net', 'http://43.228.126.245/EMS-API2');
      }

   
      return (
        <TouchableOpacity onPress={() => Linking.openURL(selectedItemSub[0].video_link)} key={index}>
        <Image
          source={{ uri: src }}
          style={{ width: Number(width), height: Number(height), resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      );
    }

    if (node.name === 'p' && node.children && node.children.length > 0 && node.children[0].type === 'text' && node.children[0].data === '\u00a0') {
      return null;
    }

    if (node.name === 'p') {
      // Remove margin and padding for paragraphs
      return <Text key={index} style={{ margin: 0, padding: 0,color: 'black' }}>{defaultRenderer(node.children, parent)}</Text>;
    }
  };

  return (
    <Modal isVisible={detailviewSub} onBackdropPress={onDismissSub}
      onBackButtonPress={onDismissSub}>
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', color: 'black' }}>{selectedItemSub && selectedItemSub[0]?.title}</Text>
          {selectedItemSub?.video_link && (
            <Text onPress={() => Linking.openURL(selectedItemSub.video_link)}>Watch Video</Text>
          )}
          <MI size={25} color={'#222'} name="clear"
            onPress={() => setDetailViewSub(!detailviewSub)}
          ></MI>
        </View>

        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
          </View>
          <View
            style={{
              height: 0.6,
              width: '100%',
              backgroundColor: '#ccc',
              marginVertical: 5,
              alignSelf: 'center',
            }}></View>
          {selectedItemSub && selectedItemSub[0] && selectedItemSub[0].description !== undefined ? (
            selectedItemSub[0].description !== '' ? (
              <HTMLView value={selectedItemSub[0].description} renderNode={renderNode} />
            ) : (
              <Text style={{ color:'black'}}>No description available</Text>
            )
          ) : (
            <Text style={{ color:'black'}}>No description available</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}