import React from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#E8E8E8'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#E8E8E8',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 12,
        fontStyle: 'bold',
    },
    description: {
        width: '85%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
    total: {
        width: '19%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });
export default function SubTotal({profile}) {
    const amounts = profile?.map((transaction) => transaction.rate);
    const total= amounts?.reduce((acc, item) => (Number(acc) + Number(item)), 0).toFixed(2);
return(    
    <View style={styles.row}>
        <Text style={styles.description}>SubTotal</Text>
        <Text style={styles.total}>{ Math.round(Number.parseFloat(total)) }</Text>
    </View>
)
}
