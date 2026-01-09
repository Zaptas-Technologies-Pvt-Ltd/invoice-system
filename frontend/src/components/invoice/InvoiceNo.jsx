import React, { Fragment, useEffect, useState } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer';
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
    ownCompany: {
        fontSize: 18,
        fontStyle: 'bold',
    },
    ownAddress: {
        fontSize: 8,
        fontStyle: 'bold',
    },
    label: {
        marginRight: 5,
        textAlign: 'left',
        fontSize: 9,
    }
});

export default function InvoiceNo({ invoice }) {   // receive invoice prop here
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [GSTNo, setGSTNo] = useState("");

    useEffect(() => {
        GetLoginUserDetails().then(function (result) {
            setCompanyName(result.companyName);
            setAddress(result.companyAddress);
            setGSTNo(result.companyGST);
        });
    }, []);

    // choose title dynamically:
    let title;
    if (invoice.isQuotation) {
        title = "Quotation";
    } else {
        title = invoice.piperformerinvoice==true ? "P.Invoice" : "Tax Invoice";
    }


    return (
        <Fragment>
            <View style={styles.invoiceNoContainer}>
                <Text style={styles.ownCompany}>{companyName}</Text>
            </View>
            <View style={styles.invoiceNoContainer}>
                <Text style={styles.ownAddress}>({address})</Text>
            </View>
            <View style={styles.invoiceGSTContainer}>
                <Text style={styles.label}>GSTIN:</Text>
                <Text>{GSTNo}</Text>
            </View>
            <InvoiceTitle title={title} />
        </Fragment>
    )
}
