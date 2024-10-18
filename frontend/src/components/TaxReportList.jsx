import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import { useAlert } from "react-alert";
import DataTable from 'react-data-table-component'
import Spinner from '../components/Spinner';
import Moment from 'moment'

export default function TaxReportList({FromDate,ToTODate,SACCodeFilt,resetForm}) {
    // const alert = useAlert();
    const [loading, setLoading] = useState(false)
    // const [showDownloadForm, setShowDownloadForm] = React.useState(false);
    const [searchreport, setSearchReport] = useState('')
    const [countries, setCountries] = useState([])
    const [filteredcountries, setFilteredCountries] = useState([])
    // const [taxamounts, setTaxAmounts] = useState([])
    // const [SubTotalamounts, setSubTotalAmounts] = useState([])
    // const [totalamounts, setTotalAmounts] = useState([])

    const getCountries = async (FromDate,ToTODate) => {
        try{
            setLoading(true)
            const response = await axios.get("https://invoice-system-h9ds.onrender.com/api/getInvoice?fromdate="+FromDate+"&todate="+ToTODate+"&saccode="+SACCodeFilt
            ,{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
            if(response.data.success === true) {
                setLoading(false)
                setCountries(response.data.data);
                setFilteredCountries(response.data.data);
            }else{
                setLoading(false)
                setCountries([]);
                setFilteredCountries([]);
            }
        }catch(error) {
            setLoading(false)
            console.log(error);
        }
    };
    const columns = [
        {
            name: 'Invoice No.',
            selector: (row) => row.invoice,
        },
        {
            name: 'Invoice Date',
            selector: (row) => Moment(row.createdAt).format("DD-MM-YYYY"),
        },
        {
            name: 'Customer',
            selector: (row) => row.customer.name,
        },
        {
            name: 'SAC Code',
            selector: (row) =>row.service_code
            //     row.service_code.map(item => (
            //         item1.concat(item,', ')
            // )),
        },
        {
            name: 'Amount',
            selector: (row) => row.profileName_rate?.map((transaction) => transaction.rate)
            .reduce((acc, item) => (Number(acc) + Number(item)), 0),
        },
        {
            name: 'Tax',
            selector: (row) => row.profileName_rate.map(item => item.rate*18/100)
            .reduce((accumulator, currentValue) => accumulator + currentValue , 0),
        },
        {
            name: 'Total',
            selector: (row) => row.profileName_rate?.map((transaction) => transaction.rate)
                   .reduce((acc, item) => (Number(acc) + Number(item)), 0)+row.profileName_rate.map(item => item.rate*18/100)
                   .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
            
        },
        // {
        //     name: "Action",
        //     cell:(row) => <button className='btn btn-primary' onClick={() => alert('Test')}>Edit</button>
        // },
    ];
    useEffect(() => {
        if(resetForm === true){
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
