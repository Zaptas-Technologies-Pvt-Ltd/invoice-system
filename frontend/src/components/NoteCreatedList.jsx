import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Spinner from '../components/Spinner';
import { HiTrash } from 'react-icons/hi';
import Services from '../service/Services';
import { useNavigate } from 'react-router-dom';

export default function NoteCreatedList() {
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [filterDataList, setFilteredData] = useState([])
  const [searchNote, setSearchNote] = useState('')

  const getNoteList = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/v1/api/note-list", { headers: { "authorization": `Bearer ${localStorage.getItem('token')}` } });
      if (response.data.success === true) {
        setLoading(false)
        setDataList(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setLoading(false)
        setDataList([]);
        setFilteredData([]);
      }

    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };
  const statusUpdate = async (e) => {
    try {
      if (window.confirm("Do you really want to change?")) {
        setLoading(true)
        Services.Common.status_update(e).then(function (data) {
          setLoading(false)
          navigation('/');
        });
      }

    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }
  const deleteUpdate = async (e) => {
    try {
      if (window.confirm("Do you really want to delete?")) {
        setLoading(true)
        Services.Common.delete_update(e).then(function (data) {
          console.log(data)
          setLoading(false)
          navigation('/');
        });
      }

    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }
  useEffect(() => {
    getNoteList()
  }, []);
  useEffect(() => {
    const result = dataList.filter((value) => {
      return value.customerid?.name?.toLowerCase().match(searchNote.toLowerCase());
    });
    setFilteredData(result)
  }, [searchNote]);

  
  const columns = [
    {
      name: 'Invoice No.',
      selector: (row) => row.invoiceid?.invoice || row.invoiceno,
      sortable: true,
      grow: 0,
      style: { fontWeight: 'bold' }
    },
    {
      name: 'Invoice Date',
      selector: (row) => row.invoicedate,
      sortable: true,
      grow: 0.5
    },
    {
      name: 'Customer',
      selector: (row) => row.customerid?.name,
      sortable: true,
    },
    {
      name: 'SAC Code',
      selector: (row) => row.servicecode[0],
    },
    {
      name: 'Service',
      selector: (row) => row.servicename,
      sortable: true,
    },
    {
      name: 'Current Stage',
      cell: (row) => {
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold
          ${row.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
            {row.status ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      name: 'Total (₹)',
      selector: (row) => row.notelistdata.reduce(
        (acc, item) => acc + Number(item.rate || 0), 0),
      sortable: true,
      right: true,
      cell: (row) => {
        const total = row.notelistdata.reduce(
          (acc, item) => acc + Number(item.rate || 0), 0);
        return (
          <span className={`font-semibold ${total > 20000 ? 'text-red-600' : ''}`}>
            ₹{total.toLocaleString()}
          </span>
        );
      }
    },
    {
      name: 'Note Status',
      cell: (row) =>
        row.status ? (
          <button
            className="rounded px-2 text-green-600 ring-2 ring-green-500 text-xs"
            onClick={() => statusUpdate(`${row._id}-0-note`)}
          >
            Active
          </button>
        ) : (
          <button
            className="rounded px-2 text-red-600 ring-2 ring-red-500 text-xs"
            onClick={() => statusUpdate(`${row._id}-1-note`)}
          >
            Inactive
          </button>
        )
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <span
            className="btn btn-danger ml-2"
            onClick={() => deleteUpdate(`${row._id}-1-note`)}
          >
            <HiTrash />
          </span>
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
          title="Note List"
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
            <input type="text" placeholder="Search customer name..."
              value={searchNote} onChange={(e) => setSearchNote(e.target.value)}
              className="w-25 form-control" style={{ marginLeft: -8 }} />
          }
          subHeaderAlign='left'
        />

      </div>
    </div>
  )
}
