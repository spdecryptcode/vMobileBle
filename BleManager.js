import {Alert, NativeModules} from 'react-native';
const bleManager = NativeModules.BleManager;
class BleManager {
  // function to enable bluetooth
  enableBluetooth() {
    return new Promise((resolve, reject) => {
      bleManager.enableBluetooth(error => {
        if (error != null) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // function to initialize ble manager
  start(options) {
    return new Promise((resolve, reject) => {
      if (options == null) {
        options = {};
      }

      bleManager.start(options, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // function to stop scanning
  stopScan() {
    return new Promise((resolve, reject) => {
      bleManager.stopScan(error => {
        if (error != null) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // function to connect to a peripheral or device
  connect(peripheralId) {
    return new Promise((resolve, reject) => {
      bleManager.connect(peripheralId, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  // function to read a connected peripheral
  readRSSI(peripheralId) {
    return new Promise((resolve, reject) => {
      bleManager.readRSSI(peripheralId, (error, rssi) => {
        if (error) {
          reject(error);
        } else {
          resolve(rssi);
        }
      });
    });
  }

  // function to get all connected peripherals ot devices
  retrieveServices(peripheralId, services) {
    return new Promise((resolve, reject) => {
      bleManager.retrieveServices(
        peripheralId,
        services,
        (error, peripheral) => {
          if (error) {
            reject(error);
          } else {
            resolve(peripheral);
          }
        },
      );
    });
  }

  //  function to disconnect from a peripheral or device
  disconnect(peripheralId) {
    // return new Promise((resolve, reject) => {
    //   bleManager.disconnect(peripheralId, error => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });

    bleManager
      .disconnect(peripheralId)
      .then(() => {
        console.log('Disconnected');
      })
      .catch(error => {
        console.log('Disconnected error:', error);
      });
  }

  // checkState() {
  //   bleManager.checkState();
  // }

  scan(serviceUUIDs, seconds, allowDuplicates, scanningOptions = {}) {
    return new Promise((resolve, reject) => {
      if (allowDuplicates == null) {
        allowDuplicates = false;
      }

      // (ANDROID) Match as many advertisement per filter as hw could allow
      // dependes on current capability and availability of the resources in hw.
      if (scanningOptions.numberOfMatches == null) {
        scanningOptions.numberOfMatches = 3;
      }

      // (ANDROID) Defaults to MATCH_MODE_AGGRESSIVE
      if (scanningOptions.matchMode == null) {
        scanningOptions.matchMode = 1;
      }

      // (ANDROID) Defaults to SCAN_MODE_LOW_POWER on android
      if (scanningOptions.scanMode == null) {
        scanningOptions.scanMode = 0;
      }

      if (scanningOptions.reportDelay == null) {
        scanningOptions.reportDelay = 0;
      }

      bleManager.scan(
        serviceUUIDs,
        seconds,
        allowDuplicates,
        scanningOptions,
        error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  }

  getConnectedPeripherals(serviceUUIDs) {
    return new Promise((resolve, reject) => {
      bleManager.getConnectedPeripherals(serviceUUIDs, (error, result) => {
        if (error) {
          reject(error);
        } else {
          if (result != null) {
            //  Alert.alert(JSON.stringify(result))
            resolve(result);
          } else {
            resolve([]);
          }
        }
      });
    });
  }

  // setName(name) {
  //   bleManager.setName(name);
  // }
}

module.exports = new BleManager();
