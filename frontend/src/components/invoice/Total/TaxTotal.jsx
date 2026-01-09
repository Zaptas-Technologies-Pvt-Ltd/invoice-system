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
export default function TaxTotal({tax,profile}) {
    const amounts = profile?.map((transaction) => Number(transaction?.rate) || 0) || [];
    const total = amounts.length > 0 ? amounts.reduce((acc, item) => (Number(acc) + Number(item)), 0) : 0;
    var amount = 0;
    if(tax === 1){
        amount = ((total*18)/100)
    }else if(tax === 2){
        amount = ((total*18)/100)
    }

return(    
    <View style={styles.row}>
        <Text style={styles.description}>Total Tax Amount</Text>
        <Text style={styles.total}>{ Math.round(Number.parseFloat(amount)) || 0 }</Text>
    </View>
)
}
