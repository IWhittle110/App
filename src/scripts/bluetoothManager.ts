import base64 from 'react-native-base64';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';

const DEVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const CHARACTERISTIC_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

class BluetoothManager {
  bleManager: BleManager;
  device: Device | null;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }

  scanForDevices = (
    onDeviceFound: (arg: {
      type: string;
      payload: BleError | Device | null;
    }) => void,
  ) => {
    this.bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      onDeviceFound({type: 'SAMPLE', payload: scannedDevice ?? error});
      return;
    });
    return () => {
      this.bleManager.stopDeviceScan();
    };
  };

  stopScanningForDevices = () => {
    this.bleManager.stopDeviceScan();
  };

  connectToPeripheral = async (deviceId: string) => {
    this.device = await this.bleManager.connectToDevice(deviceId);
  };

  onReceivedDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
    emitter: (arg: {payload: string | BleError}) => void,
  ) => {
    if (error) {
      emitter({payload: error});
    }

    const decodedData = base64.decode(characteristic?.value ?? '');
    //remove special characters
    const filteredData = decodedData.replace(/(\r\n|\n|\r)/gm, '');

    emitter({payload: filteredData});
  };

  sendData = async (data: string) => {
    await this.device?.writeCharacteristicWithResponseForService(
      DEVICE_UUID,
      CHARACTERISTIC_UUID,
      base64.encode(data),
    );
  };

  startReadingData = async (
    emitter: (arg: {payload: string | BleError}) => void,
  ) => {
    await this.device?.discoverAllServicesAndCharacteristics();
    await this.sendData('takeReading');
    this.device?.monitorCharacteristicForService(
      DEVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) =>
        this.onReceivedDataUpdate(error, characteristic, emitter),
    );
  };
}

const bluetoothManager = new BluetoothManager();

export default bluetoothManager;
