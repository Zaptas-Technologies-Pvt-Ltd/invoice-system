import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function POCreatedList() {
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [filterDataList, setFilteredData] = useState([])
  
  const getPoList = async () =>{
    try{
      setLoading(true)
      const response = await axios.get("poLists");
      setLoading(false)
      setDataList(response.data);
      setFilteredData(response.data);
    }catch(error) {
      setLoading(false)
      console.log(error);
    }
  };
  useEffect(() => {
    getPoList()
  },[]);
  useEffect(() => {
    //const result = dataList.filter((country) => {
      //return country.customer.name.toLowerCase().match(searchreport.toLowerCase());
  //});
    // setFilteredData(result)
  }, []);
  console.log(dataList)
    // const columns = [
    //     {
    //         name: 'Po No.',
    //         selector: (row) => "Test",
    //     },
    //     {
    //         name: 'Customer Name',
    //         selector: (row) => "test",
    //     },
    //     {
    //         name: 'Po Status',
    //         selector: (row) => "Test",
            
    //     },
    //     {
    //         name: 'Po Date',
    //         selector: (row) => "Test"
    //     },
    //     // {
    //     //     name: 'Amount',
    //     //     selector: (row) => "Test",
    //     // },
    //     // {
    //     //     name: 'Tax',
    //     //     selector: (row) => "Test",
    //     // },
    //     // {
    //     //     name: 'Total',
    //     //     selector: (row) => "Test"
    //     // },
    //     // {
    //     //     name: "Action",
    //     //     cell:(row) => <button className='btn btn-primary' onClick={() => alert('Test')}>Edit</button>
    //     // },
    // ];
  return (
    <div className="h-[22rem] bg-white p-4 gap-4 rounded-sm border border-gray-200 flex flex-col flex-1">
        {/* <div className="mt-5 w-full flex-1 text-xs">
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
                <input type="text" placeholder="Search here..." value={searchreport} onChange={(e) => setSearchReport(e.target.value)} className="w-25 form-control" style={{marginLeft: -8}} />
            }
            subHeaderAlign='left'
            />
        </div> */}
    </div>
  )
}
