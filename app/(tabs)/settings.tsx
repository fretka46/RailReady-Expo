import React from 'react';
import { StyleSheet, TextInput, Linking, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSettings } from '@/context/SettingsContext';

export default function TabTwoScreen() {
  const { settings, setSettings } = useSettings();

  const handleInputChange = (key: keyof typeof settings, value: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.settings}>
        <Text style={styles.label}>Začátek odpočtu časovače</Text>
        <Text style={styles.labelDesc}>Čas v sekundách od odjezdu kdy se časovač začne naplňovat barvou</Text>
        <TextInput
          style={styles.input}
          value={settings.progressbarOffset.toString()}
          onChangeText={(value) => handleInputChange("progressbarOffset", value)}
          placeholder="600"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Příchozí časy notifikací odpočtu před odjezdem</Text>
        <Text style={styles.labelDesc}>Nastavením na -1 se notifikace vypne</Text>
        <View style={styles.flexbox}>
          <View>
            <Text style={styles.label}>1. notifikace</Text>
            <TextInput
              style={[styles.input, styles.centerText]}
              value={settings.destinationNames}
              onChangeText={(value) => handleInputChange('notification1', value)}
              placeholder="60"
              placeholderTextColor="#999"
            />
          </View>
          
          <View>
            <Text style={styles.label}>2. notifikace</Text>
            <TextInput
              style={[styles.input, styles.centerText]}
              value={settings.destinationNames}
              onChangeText={(value) => handleInputChange('notification2', value)}
              placeholder="300"
              placeholderTextColor="#999"
            />
          </View>

          <View>
            <Text style={styles.label}>3. notifikace</Text>
            <TextInput
              style={[styles.input, styles.centerText]}
              value={settings.destinationNames}
              onChangeText={(value) => handleInputChange('notification3', value)}
              placeholder="600"
              placeholderTextColor="#999"
            />
          </View>
        </View>
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
  flexbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerText: {
    textAlign: 'center',
  },
});