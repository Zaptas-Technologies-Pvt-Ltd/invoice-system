import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   
    titleContainer:{
        flexDirection: 'row',
        marginTop: 10,
    },
    reportTitle:{
        color: '#808080',
        letterSpacing: 4,
        fontSize: 20,
        textAlign: 'center',
        marginLeft: 200,
        textTransform: 'uppercase',
    }
  });
  const InvoiceTitle = ({title}) => (
    <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{title}</Text>
    </View>
  );
  
  export default InvoiceTitle