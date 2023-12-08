import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

const MatchedScreen = () => {

    const navigation = useNavigation()
    const {params} = useRoute()

    const { loggedInProfile, userSwiped } = params

  return (
    <View style={styles.MatchedScreen}>
      <View style={styles.MatchImg}>
        <Image 
        style={{height:80, width:"100%", borderRadius:9999}}
        source={require("../matchImg.png")}/>
      </View>

      <Text style={{color:"white",fontWeight:500, textAlign:"center", marginTop:20}}>
        You and {userSwiped.email} have liked each other.
      </Text>
      
      <View style={styles.ImagesProf}>
        <Image style={{height:128, width:128, borderRadius:9999}} source={{uri: userSwiped.photoUrl}}/>
        <Image style={{height:128, width:128, borderRadius:9999}} source={{uri: loggedInProfile.photoUrl}}/>
      </View>

      <TouchableOpacity 
        style={styles.ButMess}
        onPress={() => {
           navigation.goBack()
           navigation.navigate('Chat') 
        }}
      >
        <Text style={{textAlign:"center",}}>Send a message</Text>
      </TouchableOpacity>

    </View>
  )
}

export default MatchedScreen

const styles = StyleSheet.create({
    ButMess:{
        backgroundColor:"white",
        margin:20,
        paddingHorizontal: 40,
        paddingVertical:32,
        marginTop:112,
        borderRadius:9999
    },
    MatchedScreen:{
        height: "100%",
        backgroundColor: "rgb(239 68 68)",
        paddingTop: 80,
        opacity:0.89
    },
    MatchImg : {
        justifyContent:"center",
        paddingHorizontal: 40,
        paddingTop: 80
    },
    ImagesProf : {
        flexDirection:"row",
        justifyContent: "space-evenly",
        marginTop:20,
    }
})