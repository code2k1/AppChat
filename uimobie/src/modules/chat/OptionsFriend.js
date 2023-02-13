import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { Image } from 'react-native'

const OptionsFriend = (props) => {

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const route = useRoute();
  const [screen, setScreen] = useState(0);
  const [mediaColor, setMediaColor] = useState('#0091ff')
  const [fileColor, setFileColor] = useState('#fff')
  const [linkColor, setLinkColor] = useState('#fff')

  const handleChangeScreen = () => {
    switch (screen) {
      case 0:
        return showMedia();
      case 1:
        return showFile();
      case 2:
        return showLink();
    }
  };
  useEffect(() => {
    if (route.params != null) {
      setNickname(route.params.nickname);
      setAvatar(route.params.avatar);
    }
  });
  return (
    <View>
      <View style={{ height: 40, justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'row', backgroundColor: '#fae7e1' }}>
        <TouchableOpacity
          style={{ marginLeft: 20, height: 30, width: 30, marginBottom: 10 }}
          onPress={() => {
            props.navigation.goBack()
          }}
        >
          <Text style={{ fontSize: 30, color: 'black' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 15, color: 'black', fontSize: 20, marginBottom: 8 }}>Options</Text>
      </View>
      <ScrollView style={{ height: '95%' }}>
        <LinearGradient
          style={{ alignItems: 'center', height: 900 }}
          colors={["#f7dad5", "#ffd0f6", "#eaebf0"]}
        >
          <Image source={{ uri: avatar ? avatar : null }} style={{ height: 100, width: 100, marginTop: 20, borderRadius: 50 }} />
          <Text style={{ fontSize: 22, marginTop: 15 }}>{nickname}</Text>
          <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, marginLeft: 20, alignItems: 'center' }}  >
              <Image source={{ uri: 'https://static.thenounproject.com/png/544983-200.png' }} style={{ width: 30, height: 30 }} />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>Shared Media</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setMediaColor('#0091ff')
                  setFileColor('#fff')
                  setLinkColor('#fff')
                  setScreen(0)
                }}
              >
                <Text>MEDIA</Text>
                <View style={{ height: 3, width: 80, backgroundColor: mediaColor, marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setMediaColor('#fff')
                  setFileColor('#0091ff')
                  setLinkColor('#fff')
                  setScreen(1)
                }}
              >
                <Text>FILES</Text>
                <View style={{ height: 3, width: 80, backgroundColor: fileColor, marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setMediaColor('#ffff')
                  setFileColor('#fff')
                  setLinkColor('#0091ff')
                  setScreen(2)
                }}
              >
                <Text>LINKS</Text>
                <View style={{ height: 3, width: 80, backgroundColor: linkColor, marginTop: 5 }} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{ height: 300, backgroundColor: '#adf', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                {handleChangeScreen()}
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  )
}

const showMedia = () => {
  return (
    <Text>Media nè</Text>
  )
}
const showFile = () => {
  return (
    <Text>Flie nè</Text>
  )
}
const showLink = () => {
  return (
    <Text>Link nè</Text>
  )
}

export default OptionsFriend

const styles = StyleSheet.create({})