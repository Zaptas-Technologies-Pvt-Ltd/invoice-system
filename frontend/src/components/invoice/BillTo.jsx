import React from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginTop: 15,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        width:"100%",
        '@media print':{
          flexDirection: 'row',
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
        },
    },
    // fromContainer:{
    //   justifyContent: 'flex-end',
    //   display:"flex",
    //   flexWrap:"wrap",
    //   flexDirection: 'column',
    //   '@media print':{
    //     justifyContent: 'flex-end',
    //     display:"flex",
    //     flexWrap:"wrap",
    //     flexDirection: 'column',
    //     '& *':{
    //       display:"block",
    //       position:"relative",
    //       textAlign: 'right !important',
    //     },
    //   },
    // },
    fromContainer:{
        textAlign: 'right !important',
    },
    billTo: {
        marginTop: 9,
        paddingBottom: 3,
        fontStyle: 'bold',
        //fontFamily: 'Helvetica-Oblique',
    },
  });

export default function BillTo({invoice}) {
  return (
    <View style={styles.headerContainer}>
        <View>
          <Text style={styles.billTo}>Bill To:</Text>
          <Text>{invoice.company}</Text>
          <Text>{invoice.address}</Text>
          <Text>GST: {invoice.phone}</Text>
          {/* <Text>{invoice.email}</Text> */}
        </View>
        <View style={styles.fromContainer}>
            <Text style={styles.invoice_nocss}>Invoice No: {invoice.invoice_no}</Text>
            <Text>Date: {invoice.trans_date}</Text>
            <Text>P.O. No: {invoice.PONo}</Text>
            <Text>P.O. Date: {invoice.PODate}</Text>
        </View>

    </View>
  )
}
