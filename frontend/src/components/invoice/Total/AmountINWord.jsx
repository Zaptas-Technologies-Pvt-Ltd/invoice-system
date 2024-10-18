import React from 'react'
import {View, Text, StyleSheet } from '@react-pdf/renderer';
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
        width: '100%',
        borderRightColor: '#E8E8E8',
        backgroundColor: '#E8E8E8',
        borderRightWidth: 1,
        alignItems: 'center',
        paddingRight: 8,
        textAlign: 'left',
        height: 23,
        fontSize: 12,
        flexGrow: 1,
    },
    total: {
        width: '19%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });
export default function AmountINWord({tax,profile}) {
    //console.log(dd)
    const amounts = profile?.map((transaction) => transaction.rate);
    const total= amounts?.reduce((acc, item) => (Number(acc) + Number(item)), 0);
    var wordAmount ='';
    const toWords = new ToWords();
    if(tax === 1){
        //var amount =((total*18)/100)+total
        wordAmount = toWords.convert(((total*18)/100)+total, { currency: true });
    }else if(tax === 2){
       // var amount =((total*18)/100)+total
        wordAmount = toWords.convert(((total*18)/100)+total, { currency: true });
    }
    //const toWords = new ToWords();
    // if(amount !== undefined){
    //     console.log(amount)
    //     var wordAmount = toWords.convert(amount, { currency: true });
        
    // }
    return(    
        <View style={styles.row}>
            <Text style={styles.description}> Amount in words: { wordAmount }</Text>
        </View>
    )
}

