import React from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';

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
    }
  });
export default function InvoiceThankYouMsg() {
  return (
    <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>Authorized Signatory</Text>
    </View>
  )
}
