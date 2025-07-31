import React, { useEffect, useState, Fragment } from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import { Page, Document, Image, StyleSheet, View } from '@react-pdf/renderer';
import {PDFViewer} from '@react-pdf/renderer'
import Services from '../../service/Services';
import Header from "../../photos/header.jpg";
import Footer from "../../photos/footer.jpeg";
import InvoiceNo from './InvoiceNo';
import InvoiceThankYouMsg from './InvoiceThankYouMsg';
import BillTo from './BillTo';
import InvoiceItemsTable from './InvoiceItemsTable';
import Spinner from '../Spinner';
import BankDetails from './BankDetails';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
    logo: {
        position:'top',
        left:5,
        bottom:0,
        right:5,
    },
    fotter: {
        position:'absolute',
        left:50,
        bottom:0,
        right:50,
    }
  });
function Invoice() {
    const [loading, setLoading] = useState(false)
    const [invoiceData, setIvoicedata] = useState('')
    const {id} = useParams();
    const navigate = useNavigate();
    
    useEffect(()=> {
        try{
            setLoading(true)
            Services.Common.invoice(id).then(function(result) {
            setLoading(false)
              const data = result;
              if(data === 'undefined'){
                setIvoicedata(false)
              }else{
                setIvoicedata(data)
              }
              
            });
        }catch (error){
            console.log(error);
        }
      },[]);
    if(invoiceData.customer){
        var ClientName=invoiceData.customer.name;
        var ClientAddress=invoiceData.customer.address;
        var ClientGST=invoiceData.customer.gstno;

        var invoiceNum = invoiceData.invoice;
        var PODate = invoiceData.podate;
        var PONo = invoiceData.po;
        var taxTYPE = invoiceData.tax;
      }
    const invoice = {
      "id": id,
      "invoice_no": invoiceNum,
      "PODate": PODate,
      "PONo": PONo,
      "tax": taxTYPE,
      "bankName" :"State Bank of India",
      "accountNumber":"220000567803",
      "ifscCode" : "SBI000125",
      "ownCompany" :"Zaptas Technologies Pvt. Ltd.",
      "ownAddress": "H-160,(Suite, B-16)Sector 63, Noida Uttar Pradesh 201301",
      "GSTNUMBER" :"32AADCB2230M1Z2",
      "company": ClientName,
      "email": "brijesh.kumar@zaptas.com",
      "phone": ClientGST,
      "piperformerinvoice": invoiceData?.piperformerinvoice,
      "address": ClientAddress,
      "GST": ClientGST,
      "trans_date": invoiceData.createdAt,
      "due_date": "2022-12-12",
      "items": [
        {
          "sno": 1,
          "desc": "ad sunt culpa ",
          "qty": 5,
          "tax":18,
          "saccode":"SUD8956",
          "rate": 405.89
        },
        {
        "sno": 2,
        "desc": "ad sunt culpa ",
        "qty": 5,
        "tax":18,
        "saccode":"SUD8956",
        "rate": 405.89
      },
    ],
    "dataIN":invoiceData.service,
    "profiles": invoiceData.profileName_rate
    }
      
  return (
    <Fragment>
      {loading && <Spinner />}
      <div style={{ 
        padding: '10px 20px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Back to Home
        </button>
      </div>
      <PDFViewer width="1060" height="550" className="app" showToolbar={true}>
        <Document>
            <Page size="A4" style={styles.page}>
              <Image style={styles.logo} src={Header} fixed/>
              
            <InvoiceNo invoice={invoice}/>
            <BillTo invoice={invoice}/>
            <InvoiceItemsTable invoice={invoice} />
            <BankDetails />
            <InvoiceThankYouMsg />
            </Page>
            <View><Image style={styles.fotter} src={Footer} fixed/></View>
        </Document>
      </PDFViewer>
    </Fragment>
  )

}

export default Invoice

