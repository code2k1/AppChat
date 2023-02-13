import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native'
import React from 'react'

const Paginator = ({ data, scrollX }) => {

    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', height: 10 }}>
            {data.map((_, i) => {

                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                })

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                })

                return <Animated.View style={[styles.dot, { width: dotWidth }]} key={i.toString()} />
            })}
        </View>
    )
}


export default Paginator

const styles = StyleSheet.create({
    dot: {
        top:-100,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0,136,242,255)',
        marginHorizontal: 8
    }
})