import React from 'react'
import {View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';
import SubTotal from './Total/SubTotal';
import CGST from './Total/CGST';
import SGST from './Total/SGST';
import TaxTotal from './Total/TaxTotal';
import TotalAmountDue from './Total/TotalAmountDue';
import AmountINWord from './Total/AmountINWord';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
});
export default function InvoiceItemsTable({invoice}) {
  //console.log(invoice)
  return (
    <View style={styles.tableContainer}>
        <InvoiceTableHeader />
        <InvoiceTableRow items={invoice.items} service={invoice.dataIN} profile={invoice.profiles} />
        {/* Use here total and tax part */}
        <SubTotal items={invoice.items} dd={invoice.dataIN} profile={invoice.profiles} />
        {invoice.tax === 2?<CGST items={invoice.items} dd={invoice.dataIN} tax={invoice.tax} profile={invoice.profiles} />:''}
        <SGST items={invoice.items} dd={invoice.dataIN} tax={invoice.tax} profile={invoice.profiles} />
        <TaxTotal items={invoice.items} dd={invoice.dataIN} tax={invoice.tax} profile={invoice.profiles} />
        <TotalAmountDue items={invoice.items} dd={invoice.dataIN} tax={invoice.tax} profile={invoice.profiles} />
        <AmountINWord items={invoice.items} dd={invoice.dataIN} tax={invoice.tax} profile={invoice.profiles}/>
    </View>
  )
}
