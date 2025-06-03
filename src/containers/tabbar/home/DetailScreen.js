import { ScrollView, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
// import globalStyle from '../../styles/globalStyle'
// import colors from '../../constant/colors'
// import fontFamily from '../../constant/fontFamily'
// import Arrow from '../../assets/img/Login/ChevronRight.svg'

const DetailScreen = ({route, navigation}) => {

//   const {item} = route.params
//   const list = item.template_items.split(',')

    return (
        <Text>Hello</Text>
    // <View style={[globalStyle.container,{backgroundColor:'#eee'}]}>
    //  <View style={[{height:50,flexDirection:'row',alignItems:'center'}]}>
    //     <TouchableOpacity onPress={()=>navigation.goBack()}>
    //     <View style={globalStyle.rowCenter}>
    //       <Arrow></Arrow>
    //       <Text style={[globalStyle.ml10,globalStyle.paragraph]}>Choose template</Text>
    //     </View> 
    //     </TouchableOpacity>
    //     <View></View>
    //  </View>
    // <ScrollView showsVerticalScrollIndicator={false}> 
    
    //   <Text style={[{color:colors.black,fontFamily:fontFamily.AltaRegular,fontSize:25,textTransform:'uppercase'},
    //     globalStyle.mt10]}>{item.template_title}</Text>
    //   <Text style={[globalStyle.paragraph,{color:colors.black},globalStyle.mt5]}>{item.template_desp}</Text>
    //   <View style={[styles.smallBox,globalStyle.mt5]}>
    //     <Text style={[{color:colors.black,fontFamily:fontFamily.AltaRegular,fontSize:32}]}>{list.length}</Text> 
    //     <Text style={[globalStyle.paragraph,{color:colors.black}]}>Total Items</Text>
    //   </View>
    //   <Text style={[globalStyle.paragraph,{color:colors.black,fontSize:20},globalStyle.mt5]}>Items</Text>
    //   <View style={globalStyle.mt5}> 

    //   {list && list.map(litem=>(<View style={styles.itemBack}>
    //         <Text style={[globalStyle.paragraph,{fontSize:15}]}>{litem}</Text></View>))}
    //   </View>
    //   <Text style={[globalStyle.paragraph,{color:colors.secondry},globalStyle.mt5]}>+ Add or update items</Text>
    // </ScrollView>
    // </View>
  )
}

export default DetailScreen

// const styles = StyleSheet.create({
//     smallBox:{
//         backgroundColor:'#fff',
//         width:120,
//         height:120,
//         justifyContent:'center',
//         padding:10
//     },
//     itemBack:{
//         backgroundColor:colors.white,
//         padding:15,
//         marginTop:5
//     }
// })