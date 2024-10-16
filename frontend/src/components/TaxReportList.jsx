import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAlert } from "react-alert";
import DataTable from 'react-data-table-component'
import Spinner from '../components/Spinner';

export default function TaxReportList({FromDate,ToTODate,SACCodeFilt,resetForm}) {
    const alert = useAlert();
    const [loading, setLoading] = useState(false)
    const [showDownloadForm, setShowDownloadForm] = React.useState(false);
    const [searchreport, setSearchReport] = useState('')
    const [countries, setCountries] = useState([])
    const [filteredcountries, setFilteredCountries] = useState([])
    const [taxamounts, setTaxAmounts] = useState([])
    const [SubTotalamounts, setSubTotalAmounts] = useState([])
    const [totalamounts, setTotalAmounts] = useState([])

    const getCountries = async (FromDate,ToTODate) => {
        try{
            var totaltax = 0;
            var Subtotal = 0;
            var total = 0;
            var Subtotals = 0;
            var totals =0;
            setLoading(true)
            const token = localStorage.getItem('token'); // Ensure 'token' is the correct key
	  
            if (!token) {
              throw new Error('No token found');
            }
        
            // Set the headers with the token
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/getInvoice?fromdate="+FromDate+"&todate="+ToTODate+"&saccode="+SACCodeFilt,config);
            //if(response.data.length >0){
                setLoading(false)
                setCountries(response.data?.data);
                setFilteredCountries(response.data?.data);
          //  }else{
             //   alert.success('No Data Available On This Selected Date!');
           // }
           // console.log(response.data)
            response?.data?.data?.map((element) => {
            //    element.service.map((element) => {
                
            //     // Subtotal += element.qty*element.price;
            //     // Subtotals +=Subtotal;
            //     // totaltax += element.price * 18 / 100;
            //     // total += (element.price * 18 / 100)+element.price;
                
            //    })
            totals = element.profileName_rate.map(item => item.rate)
                .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
            totaltax =((totals*18)/100)
            total = totals+totaltax;
            //console.log(totals)
        })
        setTaxAmounts(totaltax)
        setSubTotalAmounts(totals)
        setTotalAmounts(total)
        }catch(error) {
            setLoading(false)
            console.log(error);
        }
    };
    var item1 ='';
    var amounts=0
    const columns = [
        {
            name: 'INV Date',
            selector: (row) => row?.podate,
        },
        {
            name: 'Invoice',
            selector: (row) => row?.invoice,
        },
        {
            name: 'Customer',
            selector: (row) => row?.customer.name,
        },
        {
            name: 'SAC Code',
            selector: (row) =>row?.service_code
            //     row.service_code.map(item => (
            //         item1.concat(item,', ')
            // )),
        },
        {
            name: 'Amount',
            selector: (row) => row?.profileName_rate?.map((transaction) => transaction.rate)
            .reduce((acc, item) => (Number(acc) + Number(item)), 0),
        },
        {
            name: 'Tax',
            selector: (row) => row?.profileName_rate?.map(item => item.rate*18/100)
            .reduce((accumulator, currentValue) => accumulator + currentValue , 0),
        },
        {
            name: 'Total',
            selector: (row) => row?.profileName_rate?.map((transaction) => transaction.rate)
                   .reduce((acc, item) => (Number(acc) + Number(item)), 0)+row.profileName_rate.map(item => item.rate*18/100)
                   .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
            
        },
        // {
        //     name: "Action",
        //     cell:(row) => <button className='btn btn-primary' onClick={() => alert('Test')}>Edit</button>
        // },
    ];
    useEffect(() => {
        if(resetForm == true){
            getCountries(FromDate='',ToTODate='',SACCodeFilt='')
        }else{
            getCountries(FromDate,ToTODate,SACCodeFilt)
        }
    }, [FromDate,ToTODate,SACCodeFilt,resetForm]);
    useEffect(() => {
        const result = countries.filter((country) => {
            return country.customer.name.toLowerCase().match(searchreport.toLowerCase());
        });
        setFilteredCountries(result)
    }, [searchreport]);
  return (
    <div className="h-[22rem] bg-white p-4 gap-4 rounded-sm border border-gray-200 flex flex-col flex-1">
        <div className="mt-5 w-full flex-1 text-xs">
            {loading && <Spinner />}
            <DataTable 
            title="Report List"
            columns={columns} 
            data={filteredcountries} 
            pagination 
            fixedHeader
            fixedHeaderScrollHeight='450px'
            selectableRows
            selectableRowsHighlight
            highlightOnHover
            subHeader
            subHeaderComponent={
                <input type="text" placeholder="Search Customer Name..." value={searchreport} onChange={(e) => setSearchReport(e.target.value)} className="w-25 form-control" style={{marginLeft: -8}} />
            }
            subHeaderAlign='left'
            />
        </div>
    </div>
  )
}
