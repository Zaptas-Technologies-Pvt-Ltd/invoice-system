import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import ServicesAddForm from '../components/ServicesAddForm';
import Spinner from '../components/Spinner';
import ServicesEditForm from '../components/ServicesEdit';

export default function Services() {
    const [loading, setLoading] = useState(false)
    const [showServicesForm, setShowServicesForm] = React.useState(false);
    const [showSelectServicesForm, setSelectShowServicesForm] = React.useState(false);
    const [selectedService , setService] = useState(null);
    const [search, setSearch] = useState('')
    const [countries, setCountries] = useState([])
    const [filteredcountries, setFilteredCountries] = useState([])
  
    const getServices = async () => {
        try{
            setLoading(true)
            const response = await axios.get("services");
            setLoading(false)
            setCountries(response.data);
            setFilteredCountries(response.data);
        }catch(error) {
            setLoading(false)
            console.log(error);
        }
    };
    const columns = [
        {
            name: 'Name',
            selector: (row) => row.sr_name,
        },
        {
            name: 'SAC codes',
            selector: (row) => row.sac_code,
        },
        // {
        //     name: 'Price',
        //     selector: (row) => row.price,
            
        // },
        // {
        //     name: 'Qty',
        //     selector: (row) => row.qty,
            
        // },
        {
            name: "Action",
            cell:(row,record) => <button className='rounded px-2 py-1 text-xs border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-gray-100 duration-300'
             onClick={() => {
                setService(row)
                setSelectShowServicesForm(true)
             }}>
            Edit</button>
            
        },
    ];
    useEffect(() => {
        getServices()
    }, []);
    useEffect(() => {
        const result = countries.filter((country) => {
            return country.sr_name.toLowerCase().match(search.toLowerCase());
        });
        setFilteredCountries(result)
    }, [search]);
  return (
    <div className="container mx-auto mt-6">
    {loading && <Spinner />}
        <DataTable 
        title="Service List"
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
            onClick={() => setShowServicesForm(true)}
            >Add Services</button>}
        subHeader
        subHeaderComponent={
            <input type="text" placeholder="Search here..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-25 form-control" />
        }
        subHeaderAlign='left'
        />
        {showServicesForm &&
        <ServicesAddForm  
        showServicesForm={showServicesForm} 
        setShowServicesForm={setShowServicesForm} 
        />}
        {showSelectServicesForm &&
            <ServicesEditForm 
            showSelectServicesForm={showSelectServicesForm}
            setSelectShowServicesForm={setSelectShowServicesForm}
            type={selectedService ? "edit" : "add"} 
            selectedService ={selectedService}    ///this is prop
            setService={setService}
            getServices={getServices}
            />
        }
    </div>
  )
}
