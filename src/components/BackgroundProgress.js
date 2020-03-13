import React, {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';

const BackgroundProgress = props => {
  const {percentage, children} = props;
  const height = useRef(new Animated.Value(0)).current;

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const prevPercentage = usePrevious(percentage);

  useEffect(() => {
    if (prevPercentage !== percentage) {
      Animated.timing(height, {
        toValue: percentage > 100 ? 100 : percentage,
        duration: 500,
      }).start();
    }
  }, [percentage, prevPercentage, height]);

  const h = height.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const h2 = height.interpolate({
    inputRange: [0, 100],
    outputRange: ['100%', '0%'],
  });

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Animated.View style={{height: h2, backgroundColor: '#D6304A'}} />
        <Animated.View style={{height: h, backgroundColor: '#2A0E12'}} />
      </View>
      <View
        style={{position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}}>
        {children}
      </View>
    </View>
  );
};

export default BackgroundProgress;
