import React, { useState } from 'react';
import { StyleSheet, TextInput, Linking, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const [inputValue, setInputValue] = useState('');

  const handleLinkPress = () => {
    Linking.openURL('https://api.golemio.cz/api-keys/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.settings}>
        <Text style={styles.label}>Výchozí stanice</Text>
        <Text style={styles.labelDesc}>Case-Sensitive název stanice</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Praha-Běchovice střed"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Názvy cílových stanic</Text>
        <Text style={styles.labelDesc}>Stejné názvy jako mají vlaky na svých směrových cedulích, oddělené čárkou</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Praha Masarykovo nádr., Praha hl n., Karlštejn"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Golemio API key</Text>
        <Text style={styles.labelDesc}>
          Vlastní klíč můžete získat zde:
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={styles.link}>https://api.golemio.cz/api-keys/</Text>
          </TouchableOpacity>
        </Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter key here"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settings: {
    width: '80%',
  },
  label: {
    marginTop: 20,
    alignSelf: 'flex-start',
    fontSize: 16,
  },
  labelDesc: {
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  link: {
    color: 'blue',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});