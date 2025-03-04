import React from 'react';
import { StyleSheet, TextInput, Linking, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSettings } from '@/context/SettingsContext';
import { ExternalLink } from '@/components/ExternalLink';

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
        <Text style={styles.label}>Výchozí stanice</Text>
        <Text style={styles.labelDesc}>Case-Sensitive název stanice</Text>
        <TextInput
          style={styles.input}
          value={settings.stationName}
          onChangeText={(value) => handleInputChange("stationName", value)}
          placeholder="Praha-Běchovice střed"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Názvy cílových stanic</Text>
        <Text style={styles.labelDesc}>Stejné názvy jako mají vlaky na svých směrových cedulích, oddělené čárkou</Text>
        <TextInput
          style={styles.input}
          value={settings.destinationNames}
          onChangeText={(value) => handleInputChange('destinationNames', value)}
          placeholder="Praha Masarykovo nádr., Praha hl n., Karlštejn"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Golemio API key</Text>
        <Text style={styles.labelDesc}>
          Vlastní klíč můžete získat zde: 
          <ExternalLink href="https://api.golemio.cz/api-keys/" style={styles.link}>
            <Text style={styles.link}>api.golemio.cz/api-keys/</Text>
          </ExternalLink>
        </Text>
        <TextInput
          style={styles.input}
          value={settings.apiKey}
          onChangeText={(value) => handleInputChange('apiKey', value)}
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