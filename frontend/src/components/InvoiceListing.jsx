import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Moment from 'moment'
import Services from '../service/Services'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export default function InvoiceListing() {
    const navigation = useNavigate()
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [invoiceList, setInvoiceList] = useState([])
    const [filteredcountries, setFilteredCountries] = useState([])
  
    const getInvoiceList = async () => {
        try{
            setLoading(true)
            const response = await axios.get("/api/getInvoice",{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
            if(response.data.success === true) {
                setLoading(false)
                setInvoiceList(response.data.data);
                setFilteredCountries(response.data.data);
            }else{
                setLoading(false)
                setInvoiceList([]);
                setFilteredCountries([]);
            }
        }catch(error) {
            console.log(error);
        }
    };
    const cancelInvoice = async (id)=> {
            try{
                if (window.confirm("Do you really want to cancel?")) {
                    setLoading(true)
                    Services.Common.invoice_update(id).then(function(result) {
                        //alert('Invoice cancel successfully');
                    setLoading(false)
                    navigation('/')
                        //window.location = "/invoices";
                    });
                }
                
            }catch (error){
                setLoading(false)
                console.log(error);
            }
    }
    const columns = [
        {
            name: 'Invoice No.',
            sortable: true,
            grow: 0.4,
            style: {
                //background: "#c5b9b9",
                fontWeight: 'bold',
                width:5,
              },
            selector: (row) => row.invoice,
        },
        {
            name: 'Invoice Date',
            grow: 0.5,
            selector: (row) => Moment(row.createdAt).format("DD-MM-YYYY"),
        },
        {
            name: 'Customer',
            selector: (row) => row.customer.name,
        },
        // {
        //     name: 'P.O. Date',
        //     grow: 0.5,
        //     selector: (row) => row.podate,
        // },
        {
            name: 'Status',
            grow: 0.5,
            cell:(row) =>
            <>
              {(row.status === true)?
              <button className="rounded-lg px-2 py-0 text-green-600 ring-2 ring-green-600 text-green-600 duration-300" 
              onClick={() => {  }}> Active</button>
              :
              <button className="rounded-lg px-2 py-0 text-red-600 ring-2 ring-red-700 duration-300" 
              onClick={() => {  }}> InActive</button>
              }
            </>
        },
        {
            name: "Action",
            cell:(row) => <div>
                {/* <PDFDownloadLink document={<InvoicePDF />}  filename="FORM" onClick={() => {InvoicePDF(row._id)}}> */}
                {/* <PDFDownloadLink document={<InvoicePDF />}  filename="FORM" onClick={() => {Invoice(row._id)}}>
                {({loading}) => (loading ? <button>Loading Document...</button> : <button className='rounded-lg px-2 py-1 bg-green-300 hover:bg-green-400 duration-300'>Download</button> )}
                </PDFDownloadLink> */}
                <Link to={'/InvoiceView/'+row._id} className="rounded-lg px-2 py-1 bg-blue-600 text-blue-100 hover:bg-black-700 duration-300">View</Link>
                <Link to={'/InvoicePrint/'+row._id} className="rounded-lg ml-2 px-2 py-1 bg-rose-500 text-blue-100 hover:bg-black-700 duration-300">Print</Link>
                {/* <button className="rounded-lg ml-2 px-2 py-1 bg-red-600 text-red-100 hover:bg-red-700 duration-300"
                 onClick={(e) => Invoice(row._id)} value={row._id}>  TTTTTT</button> */}
                  <button className="rounded-lg ml-2 px-2 py-1 bg-red-600 text-red-100 hover:bg-red-700 duration-300" onClick={() => {
                    cancelInvoice(row._id)
                  }}>  Cancel</button>
            </div>
                                
        },
    ];
    useEffect(() => {
        getInvoiceList()
    }, []);
    useEffect(() => {
        const result = invoiceList.filter((country) => {
            return country.customer.name.toLowerCase().match(search.toLowerCase());
        });
        setFilteredCountries(result)
    }, [search]);
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
        <div className="mt-3 w-full flex-1 text-xs">
        {loading && <Spinner />}
        <DataTable 
        title="Invoice List"
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
            <input type="text" placeholder="Search Customer Name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-25 form-control" style={{marginLeft: -8}} />
        }
        subHeaderAlign='left'
        />
        </div>
    </div>
    )
  }