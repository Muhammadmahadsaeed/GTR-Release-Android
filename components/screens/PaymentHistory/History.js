import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util'
import FileViewer from 'react-native-file-viewer';
import { useSelector } from 'react-redux';
import { Table, Row, Rows } from 'react-native-table-component';
import { createDirectory, getDir } from '../../helper/directory';
import { askPermissionForStorage } from '../../helper/permission';

const History = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState([])

  const { access_token } = useSelector(state => state.user.user);

  useEffect(() => {
    checkPermission()
    getPackage()
  }, [])

  const checkPermission = async () => {
    try {
      const res = await askPermissionForStorage()
      if (res) {
        setHasPermission(true)
        await createDirectory()
      }
    } catch (error) {
      setHasPermission(false)
      console.log("========", error);
    }
  };

  const onDownload = async () => {
    let url = 'http://app.guessthatreceipt.com/generate-pdf?order_id=3'
    try {
      if (hasPermission) {
        setIsDownloading(true)
        const RootDir = await getDir();
        const { config, fs } = ReactNativeBlobUtil;
        let options = {
          fileCache: true,
          appendExt: 'pdf',
          addAndroidDownloads: {
            title: 'Payment history',
            description: 'downloading file...',
            notification: true,
            path: `${RootDir}/${1}.pdf`,
            useDownloadManager: true,
            mediaScannable: true,
          },
        };
        config(options)
          .fetch('GET', url)
          .progress({ interval: 250 }, (received, total) => {
            console.log('progress', received / total);
          })
          .then(res => {
            setIsDownloading(false)
            FileViewer.open(res.path(), { showOpenWithDialog: true })
              .then((suc) => console.log('========', suc))
              .catch((err) => console.log('====', err));
          })
          .catch((err) => {
            setIsDownloading(false)
            console.log("err=====", err)
          })
      }
      else {
        setIsDownloading(false)
        console.log("nh h permission=========");
      }
    } catch (error) {
      setIsDownloading(false)
      console.log(error);
    }
  }

  const getPackage = () => {
    fetch('http://app.guessthatreceipt.com/api/get-orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const openPdf = async (id) => {
    let name = id + '.pdf'
    try {
      const RootDir = await getDir()
      ReactNativeBlobUtil.fs.lstat(RootDir)
        .then((stats) => {
          const found = stats.some(el => el.filename == name);
          if (!found) {
            onDownload()
          }
          else {
            let url = RootDir + `/${name}`;
            FileViewer.open(url, { showOpenWithDialog: true })
              .then((suc) => console.log('========ss', suc))
              .catch((err) => console.log('====', err));
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (error) {
      Alert.alert(`Don't know how to open this URL: ${url}`);

    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.notificationBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.month}>
            Peroid
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.rupee}>$ price</Text>
          </View>

          <Text style={styles.description}>
            Pay it forward pays for 4 other gamer
          </Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            disabled={isDownloading}
            activeOpacity={0.8}
            style={styles.btn}
            onPress={() => openPdf(1)}
          >
            {isDownloading &&
              <ActivityIndicator size={'small'} color={'white'} />
            }
            <Text style={styles.btnText} numberOfLines={1}>
              {isDownloading ? "Downloading" : "Preview"}
            </Text>

          </TouchableOpacity>
        </View>
      </View>


    </View>
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },

  notificationBox: {
    // flex: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  month: {
    color: 'gray',
    fontFamily: 'Montserrat-Regular',
  },
  rupee: {
    color: '#81b840',
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    color: 'gray',
    fontFamily: 'Montserrat-Regular',
  },
  btn: {
    backgroundColor: '#81b840',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  btnText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 16
  },

});
