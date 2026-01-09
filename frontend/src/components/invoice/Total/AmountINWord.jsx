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
    const amounts = profile?.map((transaction) => Number(transaction?.rate) || 0) || [];
    const total = amounts.length > 0 ? amounts.reduce((acc, item) => (Number(acc) + Number(item)), 0) : 0;
    var wordAmount ='';
    
    // Only calculate if we have a valid total and tax
    if (total > 0 && (tax === 1 || tax === 2)) {
        try {
            const toWords = new ToWords();
            const amount = ((total*18)/100)+total;
            if (!isNaN(amount) && isFinite(amount)) {
                wordAmount = toWords.convert(amount, { currency: true });
            }
        } catch (error) {
            console.error('Error converting amount to words:', error);
            wordAmount = '';
        }
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

