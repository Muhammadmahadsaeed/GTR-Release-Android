import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import { useSelector } from 'react-redux';
import ReactNativeBlobUtil from 'react-native-blob-util'
import FileViewer from 'react-native-file-viewer';
import { getDir } from '../../helper/directory';
const HistoryList = ({ isPermission, data }) => {

    const [hasPermission, setHasPermission] = useState(isPermission)
    const [isDownloading, setIsDownloading] = useState(false)

    const { access_token } = useSelector(state => state.user.user);

    const openPdf = async (id) => {
        let name = id + '.pdf'
        try {
            const RootDir = await getDir()
            ReactNativeBlobUtil.fs.lstat(RootDir)
                .then((stats) => {
                    console.log(stats,name);
                    const found = stats.some(el => el.filename == name);
                    if (!found) {
                        onDownload(id)
                    }
                    else {
                        let url = RootDir + `/${name}`;
                        FileViewer.open(url, { showOpenWithDialog: true, showAppsSuggestions: true })
                            .then((suc) => console.log('========ss', suc))
                            .catch(async (err) => {
                                console.log('====', err)
                                const supported = await Linking.canOpenURL(url);

                                if (supported) {
                                    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                                    // by some browser in the mobile
                                    await Linking.openURL(url);
                                } else {
                                    Alert.alert(`Don't know how to open this URL: ${url}`);
                                }
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (error) {
            Alert.alert(`Don't know how to open this URL:`);

        }

    }

    const onDownload = async (id) => {
        let url = `http://app.guessthatreceipt.com/generate-pdf?order_id=${id}`
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
                        path: `${RootDir}/${id}.pdf`,
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

    return (
        <View style={styles.notificationBox}>
            <View style={{ flex: 1 }}>
                <Text style={styles.month}>
                    {data.subscription.period_type.charAt(0).toUpperCase() + data.subscription.period_type.slice(1)}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.rupee}>${data.subscription.price}</Text>
                    <Text style={styles.monthYear}>{data.subscription.name}</Text>
                </View>

                <Text style={styles.description}>
                   Exp: {data.exp_date}
                </Text>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    disabled={isDownloading}
                    activeOpacity={0.8}
                    style={styles.btn}
                    onPress={() => openPdf(data.id)}
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
    )
}

export default HistoryList

const styles = StyleSheet.create({

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
    monthYear: {
        alignSelf: 'flex-end',
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
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

})