import React from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#E8E8E8'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#E8E8E8',
        backgroundColor: '#E8E8E8',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    description: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    saccode: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    tax: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    amount: {
        width: '19%'
    },
  });
export default function InvoiceTableHeader() {
  return (
    <View style={styles.container}>
        <Text style={styles.saccode}>SAC CODE</Text>
        <Text style={styles.description}>Services</Text>
        <Text style={styles.rate}>Rate</Text>
        <Text style={styles.qty}>QTY</Text>
        <Text style={styles.amount}>Amount (INR)</Text>
    </View>
  )
}
