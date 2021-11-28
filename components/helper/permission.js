import { Platform, PermissionsAndroid } from 'react-native'

function askPermissionForStorage() {
    return new Promise(async (resolve, reject) => {
        if (Platform.OS !== 'android') {
            resolve(true);
        }
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                } else {
                    reject(false)
                }
            } catch (err) {
                reject(false)
            }
        }
    })

}


export { askPermissionForStorage }