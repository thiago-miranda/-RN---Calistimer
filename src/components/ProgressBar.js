import React, {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';

const ProgressBar = props => {
  const {color, percentage, height} = props;
  const width = useRef(new Animated.Value(0)).current;

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
      Animated.timing(width, {
        toValue: percentage,
        duration: 500,
      }).start();
    }
  }, [percentage, prevPercentage, width]);

  const w = width.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <Animated.View
        style={{
          width: w,
          height: height ? height : 3,
          backgroundColor: color ? color : 'white',
        }}
      />
    </View>
  );
};

export default ProgressBar;
