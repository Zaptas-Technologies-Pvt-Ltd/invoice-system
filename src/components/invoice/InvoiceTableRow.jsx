import React, {Fragment} from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#E8E8E8'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#E8E8E8',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    description: {
        width: '40%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    description1: {
        width: '40%',
        textAlign: 'left',
        borderRightColor: borderColor,
        backgroundColor: '#D1F5FF',
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    saccode: {
        width: '20%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    qty1: {
        width: '8%',
        borderRightColor: borderColor,
        backgroundColor: '#D1F5FF',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    tax: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '19%',
        textAlign: 'right',
        paddingRight: 8,
    },
    rate1: {
        width: '15%',
        borderRightColor: borderColor,
        backgroundColor: '#D1F5FF',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount1: {
        width: '19%',
        textAlign: 'right',
        backgroundColor: '#D1F5FF',
        paddingRight: 8,
    },
  });
export default function InvoiceTableRow({items,service,profile}) {

    const rows =service?.map((item, index) =>
        <View style={styles.row} key={index}>
         {/* <View style={styles.row}> */}
            <Text style={styles.saccode}>{item.sac_code}</Text>
            <Text style={styles.description}>{item.sr_name}</Text>
            <Text style={styles.rate}>-</Text>
            <Text style={styles.qty}>-</Text>
            <Text style={styles.amount}>-</Text>
        </View>
        )
    const rowse =profile?.map((pitem, index) =>
        <View style={styles.row} key={index}>
            <Text style={styles.saccode}>-</Text>
            <Text style={styles.description1}>{pitem.profileName}</Text>
            <Text style={styles.rate1}>{pitem.rate}</Text>
            <Text style={styles.qty1}>1</Text>
            <Text style={styles.amount1}>{(pitem.rate)}</Text>
        </View>
    )
    return (<Fragment>{rows}{rowse}</Fragment> )
}
