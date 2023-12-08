import { StyleSheet, Text, TouchableOpacity, View, Button, SafeAreaView, Image } from 'react-native'
import React, {useLayoutEffect,useEffect, useRef, useState} from 'react'
import { auth } from '../firebase'
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';
import { Ionicons,SimpleLineIcons, Entypo, AntDesign } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import MyImg from '../kiki.jpeg'
import {collection, doc, setDoc, onSnapshot, getDocs, query, where, getDoc, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generated';

const HomeScreen = ({route}) => {

  const navigation = useNavigation()
  const swipeRef = useRef(null)

  const [profiles, setProfiles] = useState([])

  const se = route.params?.variable || '{}'

  console.log("se",JSON.parse(se))

  const DUMMY_Data = [
    {
      "id": 1,
      "firstName": "Kiki",
      "lastName": "Ewoki",
      "occupation": "Developpeur",
      "age": 30,
      "gender": "male",
      "photoURL": MyImg
    },
    {
      "id": 2,
      "firstName": "Dombou",
      "lastName": "Ebeny",
      "occupation": "Monstre",
      "age": 40,
      "gender": "male",
      "photoURL": MyImg
    },
    {
      "id": 3,
      "firstName": "Kiki",
      "lastName": "Ewoki",
      "occupation": "Developpeur",
      "age": 30,
      "gender": "male",
      "photoURL": MyImg
    },
    {
      "id": 4,
      "firstName": "Kiki",
      "lastName": "Ewoki",
      "occupation": "Developpeur",
      "age": 30,
      "gender": "male",
      "photoURL": MyImg
    }
  ]

  useLayoutEffect(() =>  onSnapshot(doc(db, 'users', JSON.parse(se).uid), snapshot => {
      console.log("snapshot",snapshot)
      if(!snapshot.exists()){
        navigation.navigate('Modal', {variable: JSON.parse(se)})
      }
    } )
  , [])

  const SignOut = () => {
    signOut(auth).then(() => {
      navigation.replace("Login")
      console.log("Sign out successfuly");
    }).catch(error => alert(error.message))
  }

useEffect( () => {
  let unsubscribe

  

  const fectCards = async () => {


    const passes = await getDocs(collection(db, 'users', JSON.parse(se).uid, 'passes')).then
    (snapshot => snapshot.docs.map(doc => doc.id)
    )

    const swipes = await getDocs(collection(db, 'users', JSON.parse(se).uid, 'swipes')).then
    (snapshot => snapshot.docs.map(doc => doc.id)
    )

  const passedUserIds = passes.length > 0 ? passes : ['test']
  const swipedUserIds = swipes.length > 0 ? swipes : ['test']

    unsubscribe = onSnapshot(
      query(
        collection(db, 'users'), 
        where("id", "not-in", [...passedUserIds, ...swipedUserIds])
      ), 
      (snapshot) => {
        setProfiles(
          snapshot.docs.filter(doc => doc.id !== JSON.parse(se).uid).map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        ) 
    })
  }
  fectCards();
  return unsubscribe;
}, [db])

const swipeLeft = async (cardIndex) => {
  if(!profiles[cardIndex]) return;

  const userSwiped =  profiles[cardIndex]
  console.log(`You swiped PASS on ${userSwiped.email}`)

  setDoc(doc(db, 'users', JSON.parse(se).uid, 'passes', userSwiped.id),
  userSwiped
  )
}

const swipeRight = async (cardIndex) => {
  if(!profiles[cardIndex]) return;

  const userSwiped =  profiles[cardIndex]
  
  const loggedInProfile = await(
    await getDoc(doc(db, 'users', JSON.parse(se).uid))
  ).data()

  

  
  //check if the user swiped on you...
  await getDoc(doc(db, 'users', userSwiped.id, 'swipes', JSON.parse(se).uid)).then(
    (documentSnapshot) => {
      if(documentSnapshot.exists()){
        //User t'a matché avant que toi tu ne le fasses
       
        
        console.log(`Heyyyy, You MATCHED with ${userSwiped.email}`)
        setDoc(doc(db, 'users', JSON.parse(se).uid, 'swipes', userSwiped.id),
        userSwiped
        )

        //Création du MATCH
        setDoc(doc(db, 'matches', generateId(JSON.parse(se).uid, userSwiped.id)),
          {
            users: {
              [JSON.parse(se).uid]: loggedInProfile,
              [userSwiped.id]: userSwiped
            },
            usersMatched : [JSON.parse(se).uid, userSwiped.id],
            timestamp: serverTimestamp()
          })

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped
          })

      } else {
        //User has swiped as first interaction between the two or didnt get swiped on...
        console.log(`You swiped  on ${userSwiped.email} (${userSwiped.job})`)

        setDoc(doc(db, 'users', JSON.parse(se).uid, 'swipes', userSwiped.id),
        userSwiped
        )
        console.log('userSwiped',userSwiped)
      }
    }
  )

 /* console.log('userSwiped',userSwiped)

  console.log(`You swiped  on ${userSwiped.email} (${userSwiped.job})`)

  setDoc(doc(db, 'users', JSON.parse(se).uid, 'swipes', userSwiped.id),
  userSwiped
  )*/

}

  return (
    <SafeAreaView style={{flex: 1}}>

    {/* Header */}
    <View style={styles.container}>
      <TouchableOpacity onPress={SignOut}>
        <SimpleLineIcons name="logout" size={30} color="#FF5864" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Modal', {variable: JSON.parse(se)})}>
        <Image style={styles.image} source={require("../logo.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatBubble} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864"/>
      </TouchableOpacity>
    </View>
    {/* End of header */}

    {/* card */}

    <View style={styles.swiperView}>
      <Swiper
        ref={swipeRef}
        cards={profiles}
        containerStyle={{backgroundColor : "transparent"}}
        overlayLabels={{
          left: {
            title: "NOPE",
            style:{
              label:{
                textAlign: "right",
                color:"red",
              },
            },
          },
          right: {
            title: "MATCH",
            style:{
              label:{
              textAlign: "left",
              color:"#4DED30",
              },
            },
          },
        }}
        animateCardOpacity
        verticalSwipe={false}
        onSwiped={(cardIndex) => {console.log("Bien connecté")}}
        onSwipedAll={() => {console.log('onSwipedAll')}}
        cardIndex={0}
        backgroundColor={'#4FD8E9'}
        onSwipedLeft={(cardIndex) => {
          console.log("Swipe NOPE")
          swipeLeft(cardIndex)
        }}
        onSwipedRight={(cardIndex) => {
          console.log("Swipe MATCH")
          swipeRight(cardIndex)
        }}
        renderCard={ (card) => card ?
          
           (
          <View key={card.id} style={{position:"relative",backgroundColor:"white", height: 450 ,borderRadius: 10}}>

            <Image style={styles.imgProf} source={{uri: card.photoUrl}}/>
            <View style={styles.Infos}>
              <View>
                <Text style={{fontSize:20, lineHeight:28}}>
                  {card.email}
                </Text>
                <Text>
                  {card.job}
                </Text>
              </View>
              <Text style={{fontSize:24, lineHeight:32}}>
                  {card.age}
                </Text>
            </View>

          </View>
  ) : (
    <View style={styles.Infos2}>
              <Text style={{fontSize:24, lineHeight:32}}>
                  No more pictures
              </Text>
              <Image style={{height:"60%", width:'90%'}}
                height={100}
                width={100}
              source={require("../pleure.png")}/>
    </View>
    )
}
     
     ></Swiper>        
    </View>

    {/* card */}

    <View style={styles.heartCross}>
      <TouchableOpacity 
      onPress={()=> swipeRef.current.swipeLeft()}
      style={{alignItems:"center", justifyContent:"center", borderRadius:9999, width:70, height:70, backgroundColor:"rgb(254 202 202)"}}
      >
        <Entypo name='cross' size={30} color="red"/>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={()=> swipeRef.current.swipeRight()}
      style={{alignItems:"center", justifyContent:"center", borderRadius:9999, width:70, height:70, backgroundColor:"rgb(187 247 208)"}}
      >
        <Entypo name='heart' size={30} color="green"/>
      </TouchableOpacity>
    </View>
      
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  heartCross:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginBottom:30
  },
  Infos2 : {
    backgroundColor:'white',
    gap:40,
    height: "75%",
    position:'relative',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: {
      width:0,
      height:1,
    },
    shadowOpacity:0.2,
    shadowRadius:1.41,
    elevation:2
  },
  Infos : {
    backgroundColor:'white',
    width: "100%",
    height: 70,
    position:'absolute',
    bottom: 0,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical: 18,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    shadowColor: '#000',
    shadowOffset: {
      width:0,
      height:1,
    },
    shadowOpacity:0.2,
    shadowRadius:1.41,
    elevation:2
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 15
  },
 image : {
   width:80,
   height:80 
  },
  swiperView : {
    flex:1,
    marginTop:-30
  },
  imgProf : {
    width: "100%",
    position: 'absolute',
    top:0,
    height: "100%",
    borderRadius:10
  }
})