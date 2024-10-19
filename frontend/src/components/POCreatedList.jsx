import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Spinner from '../components/Spinner';
import { HiTrash } from 'react-icons/hi';
import Services from '../service/Services';
import { useNavigate } from 'react-router-dom';

export default function POCreatedList() {
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [filterDataList, setFilteredData] = useState([])
  const [searchPO, setSearchPO] = useState('')
  
  const getPoList = async () =>{
    try{
    setLoading(true)
      const response = await axios.get("/v1/api/po-list",{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
      if(response.data.success === true){
        setLoading(false)
        setDataList(response.data.data);
        setFilteredData(response.data.data);
      }else{
        setLoading(false)
        setDataList([]);
        setFilteredData([]);
      }
     
    }catch(error) {
      setLoading(false)
      console.log(error);
    }
  };
  const statusUpdate = async (e)=> {
    try{
        if (window.confirm("Do you really want to change?")) {
            setLoading(true)
            Services.Common.status_update(e).then(function(data) {
                //alert('Invoice cancel successfully');
            setLoading(false)
            navigation('/');
                //window.location = "/pocreates";
            });
        }
        
    }catch (error){
        setLoading(false)
        console.log(error);
    }
  }
  const deleteUpdate = async (e)=> {
    try{
        if (window.confirm("Do you really want to delete?")) {
            setLoading(true)
            Services.Common.delete_update(e).then(function(data) {
                //alert('Invoice cancel successfully');
                console.log(data)
            setLoading(false)
            navigation('/');
               // window.location = "/pocreates";
            });
        }
        
    }catch (error){
        setLoading(false)
        console.log(error);
    }
  }
  useEffect(() => {
    getPoList()
  },[]);
  useEffect(() => {
    const result = dataList.filter((value) => {
      return value.customerid.name.toLowerCase().match(searchPO.toLowerCase());
  });
    setFilteredData(result)
  }, [searchPO]);
    const columns = [
        {
            name: 'PO No.',
            sortable: true,
            grow: 0,
            style: {
              //background: "#c5b9b9",
              fontWeight: 'bold',
              width:5,
            },
            selector: (row) => row.pono,
        },
        {
          name: 'PO Date',
          grow: 0.5,
          selector: (row) => row.podate
      },
        {
            name: 'Customer Name',
            sortable: true,
            selector: (row) => row.customerid.name,
        },
        {
          name: 'SAC Code',
          className: 'break-words',
          selector: (row) => row.servicecode[0],
        },
        {
          name: 'Service',
          sortable: true,
          selector: (row) => row.servicename,
        },
        {
            name: 'Po Status',
            grow: 0.5,
            cell:(row) => 
            <>
              {(row.status === true)?
              <button className="rounded-lg px-2 py-0 text-green-600  ring-2 ring-green-600 text-green-600 duration-300" 
              onClick={() => statusUpdate(row._id+'-'+'0'+'-'+'po')}> Active</button>
              :
              <button className="rounded-lg px-2 py-0 text-red-600 ring-2 ring-red-700 duration-300" 
              onClick={() => statusUpdate(row._id+'-'+'1'+'-'+'po')}> InActive</button>
              }
            </>
        },
        
        {
          name: 'Total',
          selector: (row) => row.polistdata.map((name) => name.rate)
                .reduce((acc, item) => (Number(acc) + Number(item)), 0),
         },
        {
          name:"Action",
          cell: (row) => (
              <>
              {/* <span className='btn btn-primary ml-2'><HiOutlinePencilAlt /></span> */}
              <span className='btn btn-danger ml-2' onClick={() =>deleteUpdate(row._id+'-'+'1'+'-'+'po')}><HiTrash /></span>
            </>
          ),
        
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];
  return (
    <div className="h-[15rem] bg-white p-4 gap-4 rounded-sm border border-gray-200 flex flex-col flex-1">
        <div className="mt-5 w-full flex-1 text-xs">
            {loading && <Spinner />}
            <DataTable 
            title="PO List"
            columns={columns} 
            data={filterDataList} 
            pagination 
            fixedHeader
            fixedHeaderScrollHeight='450px'
            selectableRows
            selectableRowsHighlight
            highlightOnHover
            subHeader
            subHeaderComponent={
                <input type="text" placeholder="Search customer name..." value={searchPO} onChange={(e) => setSearchPO(e.target.value)} className="w-25 form-control" style={{marginLeft: -8}} />
            }
            subHeaderAlign='left'
            />
        </div>
    </div>
  )
}
