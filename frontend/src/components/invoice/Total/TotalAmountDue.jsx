import React from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { ToWords } from 'to-words';

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
export default function TotalAmountDue({items,tax,dd,profile}) {
    // const total = dd?.map(item => item.qty * item.price)
    // .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    const amounts = profile?.map((transaction) => transaction.rate);
    const total= amounts?.reduce((acc, item) => (Number(acc) + Number(item)), 0);
    if(tax == 1){
        var amount =((total*18)/100)+total
    }else if(tax == 2){
        var amount =((total*18)/100)+total
    }
return(    
    <View style={styles.row}>
        <Text style={styles.description}>Total Invoice Amount</Text>
        <Text style={styles.total}>{ Math.round(Number.parseFloat(amount)) }</Text>
    </View>
)
}
