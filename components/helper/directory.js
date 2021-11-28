import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util'

function createDirectory() {
    return new Promise((resolve, reject) => {
        //make app folder
        const AppFolder = 'Media';
        let dir = ReactNativeBlobUtil.fs.dirs
        let createDir = dir.DownloadDir + '/' + AppFolder
        if (createDir) {
            console.log("directory alreay exist=====");
        } else {

            ReactNativeBlobUtil.fs.mkdir(createDir)
        }
    })
}

function getDir() {
    return new Promise((resolve, reject) => {
        const AppFolder = 'Media';
        let dir = ReactNativeBlobUtil.fs.dirs
        let dirPath = dir.DownloadDir + '/' + AppFolder
        resolve(dirPath)

    })
}


export {
    createDirectory,
    getDir
}
