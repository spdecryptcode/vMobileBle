// import React, {useState, useEffect} from 'react';
// import {
//   Text,
//   View,
//   Platform,
//   StatusBar,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   NativeModules,
//   useColorScheme,
//   TouchableOpacity,
//   NativeEventEmitter,
//   PermissionsAndroid,
//   Alert,
// } from 'react-native';
// import BleManager from './BleManager';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// const BleManagerModule = NativeModules.BleManager;
// const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const App = () => {
//   const peripherals = new Map();
//   const [isScanning, setIsScanning] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [bluetoothDevices, setBluetoothDevices] = useState([]);
//   useEffect(() => {
//     // turn on bluetooth if it is not on
//     BleManager.enableBluetooth().then(() => {
//       console.log('Bluetooth is turned on!');
//     });
//     // start bluetooth manager
//     BleManager.start({showAlert: false}).then(() => {
//       console.log('BLE Manager initialized');
//     });
//     let stopListener = BleManagerEmitter.addListener(
//       'BleManagerStopScan',
//       () => {
//         setIsScanning(false);
//         console.log('Scan is stopped');
//         handleGetConnectedDevices();
//       },
//     );
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ).then(result => {
//         if (result) {
//           console.log('Permission is OK');
//         } else {
//           PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           ).then(result => {
//             if (result) {
//               console.log('User accept');
//             } else {
//               console.log('User refuse');
//             }
//           });
//         }
//       });
//     }
//     return () => {
//       stopListener.remove();
//     };
//   }, []);
//   const startScan = () => {
//     if (!isScanning) {
//       BleManager.scan([], 5, false)
//         .then(() => {
//           setIsScanning(true);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   };
//   const handleGetConnectedDevices = () => {
//     BleManager.getConnectedPeripherals([]).then(results => {
//       if (results.length == 0) {
//         console.log('No connected bluetooth devices');
//       } else {
//         for (let i = 0; i < results.length; i++) {
//           let peripheral = results[i];
//           peripheral.connected = true;
//           peripherals.set(peripheral.id, peripheral);
//           setConnected(true);
//           setBluetoothDevices(Array.from(peripherals.values()));
//         }
//       }
//     });
//   };
//   const connectToPeripheral = peripheral => {
//     if (peripheral.connected) {
//       BleManager.disconnect(peripheral.id).then(() => {
//         peripheral.connected = false;
//         setConnected(false);
//         alert(`Disconnected from ${peripheral.name}`);
//       });
//     } else {
//       BleManager.connect(peripheral.id)
//         .then(() => {
//           let peripheralResponse = peripherals.get(peripheral.id);
//           if (peripheralResponse) {
//             peripheralResponse.connected = true;
//             peripherals.set(peripheral.id, peripheralResponse);
//             setConnected(true);
//             setBluetoothDevices(Array.from(peripherals.values()));
//           }
//           alert('Connected to ' + peripheral.name);
//         })
//         .catch(error => console.log(error));
//       /* Read current RSSI value */
//       setTimeout(() => {
//         BleManager.retrieveServices(peripheral.id).then(peripheralData => {
//           console.log('Peripheral services:', peripheralData);
//         });
//       }, 900);
//     }
//   };
//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };
//   // render list of bluetooth devices
//   const RenderItem = ({peripheral}) => {
//     const color = peripheral.connected ? 'green' : '#fff';
//     return (
//       <>
//         <Text
//           style={{
//             fontSize: 20,
//             marginLeft: 10,
//             marginBottom: 5,
//             color: isDarkMode ? Colors.white : Colors.black,
//           }}>
//           Nearby Devices:
//         </Text>
//         <TouchableOpacity onPress={() => connectToPeripheral(peripheral)}>
//           <View
//             style={{
//               backgroundColor: color,
//               borderRadius: 5,
//               paddingVertical: 5,
//               marginHorizontal: 10,
//               paddingHorizontal: 10,
//             }}>
//             <Text
//               style={{
//                 fontSize: 18,
//                 textTransform: 'capitalize',
//                 color: connected ? Colors.white : Colors.black,
//               }}>
//               {peripheral.name}
//             </Text>
//             <View
//               style={{
//                 backgroundColor: color,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: connected ? Colors.white : Colors.black,
//                 }}>
//                 RSSI: {peripheral.rssi}
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: connected ? Colors.white : Colors.black,
//                 }}>
//                 ID: {peripheral.id}
//               </Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </>
//     );
//   };
//   return (
//     <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         style={backgroundStyle}
//         contentContainerStyle={styles.mainBody}
//         contentInsetAdjustmentBehavior="automatic">
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//             marginBottom: 40,
//           }}>
//           <View>
//             <Text
//               style={{
//                 fontSize: 30,
//                 textAlign: 'center',
//                 color: isDarkMode ? Colors.white : Colors.black,
//               }}>
//               React Native BLE Manager Tutorial
//             </Text>
//           </View>
//           <TouchableOpacity
//             activeOpacity={0.5}
//             style={styles.buttonStyle}
//             onPress={startScan}>
//             <Text style={styles.buttonTextStyle}>
//               {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         {/* list of scanned bluetooth devices */}
//         {bluetoothDevices.map(device => (
//           <View key={device.id}>
//             <RenderItem peripheral={device} />
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const windowHeight = Dimensions.get('window').height;
// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     justifyContent: 'center',
//     height: windowHeight,
//   },
//   buttonStyle: {
//     backgroundColor: '#307ecc',
//     borderWidth: 0,
//     color: '#FFFFFF',
//     borderColor: '#307ecc',
//     height: 40,
//     alignItems: 'center',
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 15,
//   },
//   buttonTextStyle: {
//     color: '#FFFFFF',
//     paddingVertical: 10,
//     fontSize: 16,
//   },
// });
// export default App;


/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
var Buffer = require('buffer/').Buffer

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { stringToBytes } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  console.debug('peripherals map updated', [...peripherals.entries()]);

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.log(
        '[retrieveConnected] connectedPeripherals',
        JSON.stringify(connectedPeripherals[0].serviceUUIDs),
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        addOrUpdatePeripheral(peripheral.id, {
          ...peripheral,
          connecting: false,
          connected: true,
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          JSON.stringify(peripheralData),
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        let p = peripherals.get(peripheral.id);
        if (p) {
          addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  const readData = async () => {
    BleManager.read(
      "1333ba01-d6a4-e3fb-0e27-bb5e8fd9c5d9",
      "b38fab03-72ef-4589-afee-5eeab74b4fa0",
      "b38fab03-72ef-4589-afee-5eeab74b4fa3"
    )
      .then((readData) => {
        var encodedString = String.fromCharCode.apply(null, readData),
        decodedString = decodeURIComponent(escape(encodedString));
        console.log('decodedString'+decodedString)
        if(decodedString != '' && decodedString != null){
        Alert.alert('Success: Data has bee read. Please check console.')
        }
        else{
        Alert.alert('Failure: There\'s nothing to read.')
        }
        
        // Success code
        // console.log("Read: " + readData);
        // const buffer = Buffer.from(readData);
        // const sensorData = buffer.readUInt8(1, true);
        // console.debug(
        //   `sensorData read as:`,
        //   sensorData,
        // );
       
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

  const readDataAndroid = async () => {
    BleManager.read(
      "F8:DC:7A:79:45:58",
      "b38fab03-72ef-4589-afee-5eeab74b4fa0",
      "b38fab03-72ef-4589-afee-5eeab74b4fa3"
    )
      .then((readData) => {
        var encodedString = String.fromCharCode.apply(null, readData),
        decodedString = decodeURIComponent(escape(encodedString));
        console.log('decodedString'+decodedString)
        if(decodedString != '' && decodedString != null){
        Alert.alert('Success: Data has bee read. Please check console.')
        }
        else{
        Alert.alert('Failure: There\'s nothing to read.')
        }
        
        // Success code
        // console.log("Read: " + readData);
        // const buffer = Buffer.from(readData);
        // const sensorData = buffer.readUInt8(1, true);
        // console.debug(
        //   `sensorData read as:`,
        //   sensorData,
        // );
       
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

  const writeData = async () => {
    let stringToWrite = 'state'

    var bytes: number[] = [];   
    for(var i = 0; i < stringToWrite.length; i++) {
        var char = stringToWrite.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    const data = stringToBytes(stringToWrite);
    BleManager.writeWithoutResponse(
      "1333ba01-d6a4-e3fb-0e27-bb5e8fd9c5d9",
      "b38fab03-72ef-4589-afee-5eeab74b4fa0",
      "b38fab03-72ef-4589-afee-5eeab74b4fa1",
      data
    )
      .then(() => {
        // Success code
        console.log("Writed: " + JSON.stringify(data));
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  const writeDataAndroid = async () => {
    let stringToWrite = 'state'

    var bytes: number[] = [];   
    for(var i = 0; i < stringToWrite.length; i++) {
        var char = stringToWrite.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    const data = stringToBytes(stringToWrite);
    BleManager.writeWithoutResponse(
      "F8:DC:7A:79:45:58",
      "b38fab03-72ef-4589-afee-5eeab74b4fa0",
      "b38fab03-72ef-4589-afee-5eeab74b4fa1",
      data
    )
      .then(() => {
        // Success code
        console.log("Writed: " + JSON.stringify(data));
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch(error =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({item}: {item: Peripheral}) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;
    return (
      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => togglePeripheralConnection(item)}>
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={Platform.OS == 'android' ? readDataAndroid : readData}>
          <Text style={styles.scanButtonText}>
            {'Read data'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={Platform.OS == 'android' ? writeDataAndroid : writeData}>
          <Text style={styles.scanButtonText}>
            {'Write data'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={retrieveConnected}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable>

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default App;
