import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import Services from '../service/Services';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';

export default function InvoiceListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [invoiceList, setInvoiceList] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const getInvoiceList = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/v1/api/getInvoice', {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setInvoiceList(response.data.data);
        setFilteredInvoices(response.data.data);
      } else {
        setInvoiceList([]);
        setFilteredInvoices([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const cancelInvoice = async (id) => {
    try {
      if (window.confirm('Do you really want to cancel?')) {
        setLoading(true);
        await Services.Common.invoice_update(id, { status: false });
        await getInvoiceList(); // better UX: refresh instead of navigate
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  

  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditInvoice(null);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await axios.put(
        `/v1/api/invoice/update/${editInvoice._id}`,
        { profileName_rate: editInvoice.profileName_rate },
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShowEditModal(false);
      setEditInvoice(null);
      getInvoiceList(); // refresh list after save
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const columns = [
    {
      name: 'Invoice No.',
      sortable: true,
      grow: 0.4,
      selector: (row) => row.invoice,
      style: { fontWeight: 'bold', width: 5 },
    },
    {
      name: 'Invoice Date',
      grow: 0.5,
      selector: (row) => Moment(row.createdAt).format('DD-MM-YYYY'),
    },
    {
      name: 'Customer',
      selector: (row) => row.customer.name,
    },
    {
      name: 'Status',
      grow: 0.5,
      cell: (row) =>
        row.status ? (
          <button className="rounded-lg px-2 py-0 text-green-600 ring-2 ring-green-600 duration-300">
            Active
          </button>
        ) : (
          <button className="rounded-lg px-2 py-0 text-red-600 ring-2 ring-red-700 duration-300">
            InActive
          </button>
        ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <div>
          <Link
            to={`/InvoiceView/${row._id}`}
            className="rounded-lg px-2 py-1 bg-blue-600 text-blue-100 hover:bg-black-700 duration-300"
          >
            View
          </Link>
          <Link
            to={`/InvoicePrint/${row._id}`}
            className="rounded-lg ml-2 px-2 py-1 bg-rose-500 text-blue-100 hover:bg-black-700 duration-300"
          >
            Print
          </Link>
          <button
            className="rounded-lg ml-2 px-2 py-1 bg-red-600 text-red-100 hover:bg-red-700 duration-300"
            onClick={() => cancelInvoice(row._id)}
          >
            Cancel
          </button>
          <button
            className="rounded-lg ml-2 px-2 py-1 bg-yellow-500 text-white hover:bg-yellow-600 duration-300"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getInvoiceList();
  }, []);

  useEffect(() => {
    const result = invoiceList.filter((inv) =>
      inv.customer.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredInvoices(result);
  }, [search, invoiceList]);

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      {loading && <Spinner />}
      <DataTable
        title="Invoice List"
        columns={columns}
        data={filteredInvoices}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="450px"
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-25 form-control"
            style={{ marginLeft: -8 }}
          />
        }
        subHeaderAlign="left"
      />

      {showEditModal && editInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-center">Edit Profile Details</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              {editInvoice.profileName_rate.map((item, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50 flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <label className="w-32 font-medium text-gray-700" htmlFor={`profileName-${idx}`}>Profile Name</label>
                    <input
                      id={`profileName-${idx}`}
                      type="text"
                      value={item.profileName}
                      onChange={e => {
                        const updated = [...editInvoice.profileName_rate];
                        updated[idx].profileName = e.target.value;
                        setEditInvoice({ ...editInvoice, profileName_rate: updated });
                      }}
                      className="border p-2 rounded flex-1 min-w-0"
                      placeholder="Profile Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <label className="w-32 font-medium text-gray-700" htmlFor={`rate-${idx}`}>Rate</label>
                    <input
                      id={`rate-${idx}`}
                      type="number"
                      value={item.rate}
                      onChange={e => {
                        const updated = [...editInvoice.profileName_rate];
                        updated[idx].rate = e.target.value;
                        setEditInvoice({ ...editInvoice, profileName_rate: updated });
                      }}
                      className="border p-2 rounded flex-1 min-w-0"
                      placeholder="Rate"
                      required
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <label className="w-32 font-medium text-gray-700" htmlFor={`remark-${idx}`}>Remark</label>
                    <input
                      id={`remark-${idx}`}
                      type="text"
                      value={item.remark || ''}
                      onChange={e => {
                        const updated = [...editInvoice.profileName_rate];
                        updated[idx].remark = e.target.value;
                        setEditInvoice({ ...editInvoice, profileName_rate: updated });
                      }}
                      className="border p-2 rounded flex-1 min-w-0"
                      placeholder="Remark"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
