import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';
import { useSelector } from 'react-redux';
import { createDirectory, getDir } from '../../helper/directory';
import { askPermissionForStorage } from '../../helper/permission';
import HistoryList from './HistoryList';

const History = () => {
  const [hasPermission, setHasPermission] = useState(false)
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

  const getPackage = () => {
    // fetch('https://app.guessthatreceipt.com/api/get-orders', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     setData(result.data)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }



  return (
    <View style={styles.container}>
      {!!!data.length &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={"large"} color={"#81b840"} />
        </View>
      }
      {!!data.length &&
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <HistoryList data={item} isPermission={hasPermission} />}
        />
      }
    </View>
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

});
