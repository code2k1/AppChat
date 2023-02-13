import { StyleSheet, Text, View, useWindowDimensions, Image, Animated, ImageBackground } from 'react-native'
import React, {useState, useRef} from 'react'

const OnboardingItem = ({item}) => {
  const { width } = useWindowDimensions()
    
  return (
    <View style={[styles.container, { width }, {height:'100%'}]}>
      <Image source={item.image} style={[styles.image, {width, resizeMode:'contain'}]}/>
      <View style={{flex : 1}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
}

export default OnboardingItem

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1.5,
        justifyContent: 'center'
    },
    title: {
        top: 0,
        fontWeight:'600',
        fontSize: 20,
        marginBottom: 10,
        color: 'black',
        textAlign: 'center'
    },
    description: {
        top: 0,
        fontSize:15,
        fontWeight: '300',
        color: 'gray',
        textAlign: 'center',
        paddingHorizontal: 64
    }
})