import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { API_KEY } from "./config";

const {width, height} = Dimensions.get('screen');
const [THUMBNAIL_SIZE, THUMBNAIL_SPACING] = [80, 10];
export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState(null);
  const imageRef = React.useRef();
  const thumbRef = React.useRef();
  React.useEffect(() => {
    fetch('https://api.pexels.com/v1/search?query=nature&per_page=10', {
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      },
    }).then(res => res.json())
      .then(data => {
        setImages(data.photos)
      });
  }, []);
  if (!images) {
    return <Text>Loading...</Text>
  }
  const setActiveStatus = (index) => {
    console.log({index});
    setActiveIndex(index);
    imageRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true
    })
    if (index * (THUMBNAIL_SIZE + THUMBNAIL_SPACING) - THUMBNAIL_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (THUMBNAIL_SIZE + THUMBNAIL_SPACING) - width / 2 + THUMBNAIL_SIZE / 2,
        animated: true
      })
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true
      })
    }
  };
  console.log({images});
  return (
    <View style={styles.container}>
      <FlatList
        ref={imageRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => setActiveStatus(Math.round(ev.nativeEvent.contentOffset.x / width))}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image source={{uri: item.src.portrait}} style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}/>
            </View>
          )
        }}
        keyExtractor={item => item.id.toString()}
      />
      <FlatList
        ref={thumbRef}
        data={images}
        horizontal
        style={{position: 'absolute', bottom: 0}}
        contentContainerStyle={{padding: THUMBNAIL_SPACING}}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          console.log({activeIndex, index})
          return (
            <TouchableOpacity onPress={() => setActiveStatus(index)}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  width: THUMBNAIL_SIZE,
                  height: THUMBNAIL_SIZE,
                  marginRight: THUMBNAIL_SPACING,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: index === activeIndex ? '#FFF' : 'transparent'
                }}/>
            </TouchableOpacity>
          )
        }}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  )
    ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
