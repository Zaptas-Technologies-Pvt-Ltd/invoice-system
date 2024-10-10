import React, {Fragment, useEffect, useState} from 'react'
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTitle from './InvoiceTitle';
import { GetLoginUserDetails } from '../../helper/GetLoginUserDetails';

const styles = StyleSheet.create({
    invoiceNoContainer: {
        flexDirection: 'row',
        marginTop: 0,
        justifyContent: 'flex-end'
    },
    invoiceGSTContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        fontSize: 9,
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDate: {
            fontSize: 9,
            fontStyle: 'bold',
    },
    ownCompany: {
        fontSize: 18,
        fontStyle: 'bold',
    },
    ownAddress: {
        fontSize: 8,
        fontStyle: 'bold',
    },
    label: {
        // width: 80
        marginRight: 5,
        textAlign: 'left',
        fontSize: 9,
    }
  });
export default function InvoiceNo() {
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [GSTNo, setGSTNo] = useState("")
  useEffect(() => {
    GetLoginUserDetails().then(function(result){
        setCompanyName(result.companyName)
        setAddress(result.companyAddress)
        setGSTNo(result.companyGST)
    })
})
  return (
    <Fragment>
        <View style={styles.invoiceNoContainer}>
            <Text style={styles.ownCompany}>{companyName}</Text>
        </View >
        <View style={styles.invoiceNoContainer}>
            <Text style={styles.ownAddress}>({address})</Text>
        </View >
        <View style={styles.invoiceGSTContainer}>
            <Text style={styles.label}>GSTIN:</Text>
            <Text style={styles.invoiceGSTContainer}>{GSTNo}</Text>
        </View >
        <InvoiceTitle title='Tax Invoice'/>
    </Fragment>
  )
}
