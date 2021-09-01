import React, { Component } from 'react';
import { Alert, View } from 'react-native'
import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import { AppEventsLogger } from 'react-native-fbsdk';


class IAPPurchaseListener extends Component {
    purchaseUpdateSubscription = null
    purchaseErrorSubscription = null

    componentDidMount = async () => {
        const identifiers = [
            'gold_12_month',
            'gold_1_months',
            'gold_6_month',
            'silver_1_month',
            'silver_6_month',
            'silver_12_month',
            'love_5',
            'love_10',
            'love_15',
        ];
        const res = await RNIap.getAvailablePurchases()
        console.log("Available purchases", res)
        //FOR ANDROID
    }
    render() {
        return (
            <View></View>
        )
    }



}

export default IAPPurchaseListener;