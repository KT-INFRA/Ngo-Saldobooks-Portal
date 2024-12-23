import { EncryptStorage } from 'encrypt-storage';
import { EncryptStorageOptions, NotifyHandlerParams } from 'encrypt-storage/dist/types';

function notifyHandlerFunction(params: NotifyHandlerParams) {
  // console.log('notifyHandler', params);
}

const encryptedOptions: EncryptStorageOptions = {
  notifyHandler: notifyHandlerFunction
};

export const encryptedStorage = new EncryptStorage(import.meta.env.VITE_APP_SECRET_KEY, encryptedOptions);

export const storage = {
  getItem(key: string) {
    return encryptedStorage.getItem(key);
  },
  setItem(key: string, value: any, doNotEncrypt = false) {
    return encryptedStorage.setItem(key, value, doNotEncrypt);
  },
  removeItem(key: string) {
    return encryptedStorage.removeItem(key);
  },
  clear() {
    encryptedStorage.clear();
  }
};

export default storage;
