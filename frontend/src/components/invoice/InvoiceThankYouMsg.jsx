import React from 'react'
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import stamp from '../../photos/stamp_sig.png';

const styles = StyleSheet.create({
   
    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 0,
    },
    reportTitle:{
        fontSize: 12,
        textAlign: 'right',
        justifyContent: 'flex-end',
        // textTransform: 'uppercase',
    },
    stamp: {
      position:'top',
      height:75,
      bottom:70,
      left:90,
  },
  });
export default function InvoiceThankYouMsg() {
  return (
    <View style={styles.titleContainer}>
        <Image style={styles.stamp} src={stamp} fixed/>
        <Text style={styles.reportTitle}>Authorized Signatory</Text>
    </View>
  )
}
