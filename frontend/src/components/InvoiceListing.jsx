import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Moment from 'moment'
import Services from '../service/Services'
import Spinner from '../components/Spinner'

export default function InvoiceListing() {
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [countries, setCountries] = useState([])
    const [filteredcountries, setFilteredCountries] = useState([])
  
    const getCountries = async () => {
        try{
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
            setLoading(true)
            const response = await axios.get("http://localhost:8080/v1/api/getInvoice",config);
            setLoading(false)
            setCountries(response.data.data);
            setFilteredCountries(response.data.data);
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
                        window.location = "/invoices";
                    });
                }
                
            }catch (error){
                setLoading(false)
                console.log(error);
            }
    }
    const columns = [
        {
            name: 'Invoice',
            selector: (row) => row.invoice,
        },
        {
            name: 'Customer',
            selector: (row) => row.customer.name,
        },
        {
            name: 'P.O. Date',
            selector: (row) => row.podate,
        },
        {
            name: 'Issue Date',
            selector: (row) => Moment(row.createdAt).format("DD-MM-YYYY"),
        },
        {
            name: 'Status',
            selector: (row) => row.status?'Active':'InActive'
        },
        {
            name: "Action",
            cell:(row) => <div>
                {/* <PDFDownloadLink document={<InvoicePDF />}  filename="FORM" onClick={() => {InvoicePDF(row._id)}}> */}
                {/* <PDFDownloadLink document={<InvoicePDF />}  filename="FORM" onClick={() => {Invoice(row._id)}}>
                {({loading}) => (loading ? <button>Loading Document...</button> : <button className='rounded-lg px-2 py-1 bg-green-300 hover:bg-green-400 duration-300'>Download</button> )}
                </PDFDownloadLink> */}
                <a href={'/InvoiceView/'+row._id} className="rounded-lg ml-2 px-2 py-1 bg-blue-600 text-blue-100 hover:bg-black-700 duration-300">View</a>
                {/* <button className="rounded-lg ml-2 px-2 py-1 bg-red-600 text-red-100 hover:bg-red-700 duration-300"
                 onClick={(e) => Invoice(row._id)} value={row._id}>  TTTTTT</button> */}
                  <button className="rounded-lg ml-2 px-2 py-1 bg-red-600 text-red-100 hover:bg-red-700 duration-300" onClick={() => {
                    cancelInvoice(row._id)
                  }}>  Cancel</button>
            </div>
                                
        },
    ];
    useEffect(() => {
        getCountries()
    }, []);
    useEffect(() => {
        const result = countries.filter((country) => {
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
            <input type="text" placeholder="Search here..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-25 form-control" style={{marginLeft: -8}} />
        }
        subHeaderAlign='left'
        />
        </div>
    </div>
    )
  }