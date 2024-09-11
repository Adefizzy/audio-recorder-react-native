import {useEffect, useState, useCallback} from 'react';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

export default function useMediaPermission() {
  const [isPermissionGranted, setPermissionState] = useState(false);

  const showSettingsAlert = useCallback(() => {
    Alert.alert(
      'Permissions Required',
      'This app needs access to your storage and microphone. Please go to the app settings to enable permissions.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => openAppSettings()},
      ],
      {cancelable: true},
    );
  }, []);

  const checkPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);
        if (
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          setPermissionState(true);
          console.log('Recording Permissions granted');
        } else if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
          setPermissionState(true);
        } else if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          console.log('Permissions set to never ask again');
          showSettingsAlert();
        } else {
          console.log('Permissions denied');
          setPermissionState(false);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, [showSettingsAlert]);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {isPermissionGranted, checkPermission};
}
