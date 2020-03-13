import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Select = props => {
  const options = props.options;
  const [current, setCurrent] = useState(props.current);

  const checkItem = item => {
    if (Array.isArray(current)) {
      return current.indexOf(item) >= 0;
    }
    return current === item;
  };

  const hanglePress = opt => () => {
    if (Array.isArray(current)) {
      let newCurrent = current;
      const i = current.indexOf(opt);
      if (i >= 0) {
        newCurrent = [...current];
        newCurrent.splice(i, 1);
      } else {
        newCurrent = [...current, opt];
      }
      setCurrent(newCurrent);
      if (props.onSelect) {
        props.onSelect(newCurrent);
      }
    } else {
      setCurrent(opt);
      if (props.onSelect) {
        props.onSelect(opt);
      }
    }
  };

  return (
    <View>
      <Text style={styleSelect.label}>{props.label}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        {options.map(opt => {
          let id = '';
          let label = '';
          if (typeof opt === 'string') {
            id = opt;
            label = opt;
          }
          if (typeof opt === 'object') {
            id = opt.id;
            label = opt.label;
          }

          return (
            <TouchableOpacity
              key={id}
              onPress={hanglePress(id)}
              style={[checkItem(id) ? styleSelect.optSelected : null]}>
              <Text style={styleSelect.optLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styleSelect = StyleSheet.create({
  label: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 24,
  },
  opt: {
    padding: 8,
  },
  optLabel: {
    color: 'black',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 24,
    opacity: 1,
  },
  optSelected: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});

export default Select;
