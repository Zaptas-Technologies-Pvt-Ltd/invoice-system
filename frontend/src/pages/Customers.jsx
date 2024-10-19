import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import CustomerAddForm from '../components/CustomerAddForm';
import Spinner from '../components/Spinner';
import CustomerEditForm from '../components/CustomerEditForm'

export default function Customers() {
  const [loading, setLoading] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = React.useState(false);
  const [selectedshowCustomerForm, setSelectedShowCustomerForm] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredcountries, setFilteredCountries] = useState([])

  const getCustomerList = async () => {
        try{
            setLoading(true);
            const response = await axios.get('/api/customer',{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
            if(response.data.success ===true){
            setLoading(false);
            setCountries(response.data.data);
            setFilteredCountries(response.data.data);
            }else{
            setLoading(false);
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
          name: 'Name',
          selector: (row) => row.name,
      },
      {
          name: 'GST No',
          selector: (row) => row.gstno,
      },
      {
          name: 'Address',
          selector: (row) => row.address,
          
      },
      {
          name: "Action",
          cell:(row) => <button className='rounded px-2 py-1 text-xs border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-gray-100 duration-300'
                 onClick={() => {
                    setSelectedCustomer(row)
                    setSelectedShowCustomerForm(true)
                 }}>
                Edit
            </button>
            
      },
  ];
  useEffect(() => {
      getCustomerList()
      
  }, []);
  useEffect(() => {
      const result = countries.filter((country) => {
          return country.name.toLowerCase().match(search.toLowerCase());
      });
      setFilteredCountries(result)
  }, [search]);
  
return (
    <div className="container mx-auto mt-6">
        {loading && <Spinner />}
        <DataTable 
        title="Customer List"
        columns={columns} 
        data={filteredcountries} 
        pagination 
        fixedHeader
        fixedHeaderScrollHeight='450px'
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        actions={<button 
            className='text-white text-bg-color active:bg-purple-200 font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1'
            value={search}
            onClick={() => setShowCustomerForm(true)}
            >Add Customer</button>}
        subHeader
        subHeaderComponent={
            <input type="text" placeholder="Search Name here..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-25 form-control" />
        }
        subHeaderAlign='left'
        />
        {showCustomerForm &&
        <CustomerAddForm  showCustomerForm={showCustomerForm} 
        setShowCustomerForm={setShowCustomerForm} 
        />}
         {selectedshowCustomerForm &&
            <CustomerEditForm 
            selectedshowCustomerForm={selectedshowCustomerForm}
            setSelectedShowCustomerForm={setSelectedShowCustomerForm}
           // type={selectedService ? "edit" : "add"} 
            selectedCustomer ={selectedCustomer}    ///this is prop
            setSelectedCustomer={setSelectedCustomer}
            getCountries={getCustomerList}
            />
        }
    </div>
  )
}
