import { PermissionsAndroid, Platform, Alert } from "react-native";

function askForPermission() {
    return new Promise(async (resolve, reject) => {
        if (Platform.OS !== 'android') {
            resolve(true)
        }
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ])
                if (granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
                    && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    resolve(true)
                    console.log('You can use the cameras & mic')
                } else {
                    reject(false)
                    console.log('Permission denied')
                }
            } catch (err) {
                console.warn(err);
            }
        }
    })

}


export {
    askForPermission,
}