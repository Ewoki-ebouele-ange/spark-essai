import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ModalScreen = ({route}) => {

    const navigation = useNavigation()

    const [image, setImage] = useState(null)
    const [job, setJob] = useState(null)
    const [age, setAge] = useState(null)

    const seMdal = route.params?.variable || '{}'

    const incompleteForm = !image || !job || !age

    console.log('semdal',seMdal)

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', seMdal.uid), {
          id: seMdal.uid,
          email: seMdal.email,
          photoUrl: image,
          job: job,
          age: age, 
          timestamp: serverTimestamp() 
        })
          .then(() => {
            navigation.navigate('Home')
          })
        .catch((error) => {
            alert(error.message)
        })
    }

  return (
    <View style={styles.ModalStyle}>
        <Image 
            style={{height:80, width:'100%'}}
            resizeMode='contain'
            source={require("../Tinder-logo.png")}
        />
        <Text style={{fontSize:20, lineHeight:28, color:"rgb(107 114 128)"}}>Welcome {seMdal.email}</Text>

        <Text style={{color:"rgb(248 113 113)", textAlign:"center",padding:16,fontWeight:"bold"}}>
            Step 1: The Profile Pic
        </Text>

        <TextInput 
            value={image}
            onChangeText={setImage}
            placeholder='Enter a profile Pic URL' 
            style={{textAlign:"center",paddingBottom:8,fontSize:20, lineHeight:28,}}
        />

        <Text style={{color:"rgb(248 113 113)", textAlign:"center",padding:16,fontWeight:"bold"}}>
            Step 2: The Job
        </Text>

        <TextInput 
            value={job}
            onChangeText={setJob}
            placeholder='Enter your occupation' 
            style={{textAlign:"center",paddingBottom:8,fontSize:20, lineHeight:28,}}
        />

        <Text style={{color:"rgb(248 113 113)", textAlign:"center",padding:16,fontWeight:"bold"}}>
            Step 3: The Age
        </Text>

        <TextInput 
            keyboardType='numeric'
            maxLength={2}
            value={age}
            onChangeText={setAge}
            placeholder='Enter your age' 
            style={{textAlign:"center",paddingBottom:8,fontSize:20, lineHeight:28,}}
        />

    <TouchableOpacity 
    onPress={updateUserProfile}
    disabled={incompleteForm}
    style={ incompleteForm ? styles.updDis : styles.upd}    
    >
        <Text style={{color:'#fff', fontSize:20, lineHeight:28, }}>Update Profile</Text>
    </TouchableOpacity>

    </View>
    
  )
}

export default ModalScreen

const styles = StyleSheet.create({
    ModalStyle:{
        flex:1,
        alignItems:'center',
        paddingTop:4,
    },
    upd : {
        alignItems:"center",
        position:'absolute' ,
        bottom:40, 
        borderRadius:10, 
        padding:20, 
        width:256,
        backgroundColor:"rgb(248 113 113)"
    },
    updDis : {
        alignItems:"center", 
        position:'absolute' ,
        bottom:40, 
        borderRadius:10, 
        padding:20, 
        width:256,
        backgroundColor:"rgb(107 114 128)"
    },
    bg_gray: {
        backgroundColor: "rgb(107 114 128)"
    }
})