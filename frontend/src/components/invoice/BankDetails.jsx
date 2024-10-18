import React, { Fragment, useEffect, useState } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { GetLoginUserDetails } from '../../helper/GetLoginUserDetails';

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 25
    },
    bankDetail: {
        marginTop: 10,
        paddingBottom: 3,
        fontStyle: 'bold',
        textDecoration: 'underline',
        //fontFamily: 'Helvetica-Oblique'
    },
  });
export default function BankDetails() {
  const [bankName, setBankName] = useState("")
  const [acountNo, setAccountNo] = useState("")
  const [IFSCCode, setIFSCCode] = useState("")
  useEffect(() => {
  GetLoginUserDetails().then(function(result){
    setBankName(result.bankName)
    setAccountNo(result.accountNumber)
    setIFSCCode(result.ifscCode)
  })
})
  return (
    <Fragment>
        <View style={styles.headerContainer}>
        <Text style={styles.bankDetail}>Bank Details:</Text>
        <Text>Bank Name: {bankName}</Text>
        <Text>Account Number: {acountNo}</Text>
        <Text>IFSC Code: {IFSCCode}</Text>
    </View>
    </Fragment>
  )
}
