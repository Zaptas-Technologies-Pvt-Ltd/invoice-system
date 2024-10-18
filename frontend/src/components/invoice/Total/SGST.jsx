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
export default function SGST({items,tax,dd,profile}) {
    const amounts = profile?.map((transaction) => transaction.rate);
    const total= amounts?.reduce((acc, item) => (Number(acc) + Number(item)), 0).toFixed(2);
    var amount ='';
    var taxtype='';
    var name = '';
    if(tax === 1){
        amount =((total*18)/100)
        taxtype= 18;
        name = 'IGST';
    }else if(tax === 2){
        amount =((total*9)/100)
        taxtype= 9;
        name = 'SGST';
    }
return(    
    <View style={styles.row}>
        <Text style={styles.description}>{name} ({taxtype}%)</Text>
        <Text style={styles.total}>{ Math.round(Number.parseFloat(amount)) }</Text>
    </View>
)
}
