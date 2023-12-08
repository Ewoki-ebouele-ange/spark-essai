import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

  const [email, setEmail] = useState("")
  
  const [password, setPassword] = useState("")

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const serializedUser = JSON.stringify(user)
        navigation.replace("Home", {variable: serializedUser})
      }
    })
    return unsubscribe
  }, [])

  const handleSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Register in with", user.email);
      })
      .catch(error => alert(error.message))
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log("Logged in with",user);
    })
    .catch(error => alert(error.message))
}

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <View style={styles.inputContainer}>
        <TextInput 
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text) }
            style={styles.input}
        />
        <TextInput 
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry 
        />
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={handleSignIn}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonOutlineText}>Register</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer : {
    width: '80%'
  },
  input : {
    backgroundColor: 'white',
    paddingHorizontal:15,
    paddingVertical:10,
    borderRadius:10,
    marginTop:5,
  },
  buttonContainer : {
    width:'60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40
  },
  button : {
   backgroundColor:'#0782F9',
   width:'100%', 
   padding:15,
   borderRadius:10, 
   alignItems:'center'
  },
  buttonText : {
    color:'white',
    fontWeight:'700',
    fontSize:16
  },
  buttonOutline : {
    backgroundColor:'white',
    marginTop:5,
    borderColor:'#0782F9',
    borderWidth:2
  },
  buttonOutlineText : {
    color:'#0782F9',
    fontWeight:'700',
    fontSize:16
  },
})