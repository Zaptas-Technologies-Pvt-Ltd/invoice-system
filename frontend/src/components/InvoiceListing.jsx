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
  const [taxlist, settaxList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [filterPerformer, setFilterPerformer] = useState('all'); // 'all', 'yes', 'no'
  const [filterPO, setFilterPO] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterService, setFilterService] = useState('all');

  // Extract unique payment types and service names for dropdowns
  const paymentTypes = Array.from(new Set(invoiceList.map(inv => inv.payment).filter(Boolean)));
  const serviceNames = Array.from(
    new Set(
      invoiceList.flatMap(inv =>
        Array.isArray(inv.service_name) && inv.service_name.length > 0
          ? inv.service_name.flat()
          : []
      )
    )
  );

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

  const getTaxlist = async () => {
    try {
      const response = await axios.get("/v1/api/tax", { headers: { "authorization": `Bearer ${localStorage.getItem('token')}` } });
      if (response.data.success === true) {
        settaxList(response.data.data);
      } else {
        settaxList([]);
      }
    } catch (error) {
      console.log(error);
    }
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
    getTaxlist()
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
        { profileName_rate: editInvoice.profileName_rate, tax: editInvoice.ntax },

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
      name: 'Performer Invoice',
      selector: row => row.piperformerinvoice ? 'Yes' : 'No',
      sortable: true,
      grow: 0.5,
      cell: row => (
        <span className={row.piperformerinvoice ? "text-blue-600 font-semibold" : "text-gray-500"}>
          {row.piperformerinvoice ? "Yes" : "No"}
        </span>
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
    let result = invoiceList;

    // Filter by search
    if (search) {
      result = result.filter((inv) =>
        inv.customer.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(inv =>
        filterStatus === 'active' ? inv.status === true : inv.status === false
      );
    }

    // Filter by performer invoice
    if (filterPerformer !== 'all') {
      result = result.filter(inv =>
        filterPerformer === 'yes' ? inv.piperformerinvoice === true : inv.piperformerinvoice === false
      );
    }

    // Filter by PO number
    if (filterPO.trim() !== '') {
      result = result.filter(inv =>
        inv.po && inv.po.toLowerCase().includes(filterPO.trim().toLowerCase())
      );
    }

    // Filter by payment type
    if (filterPayment !== 'all') {
      result = result.filter(inv => inv.payment === filterPayment);
    }

    // Filter by service name
    if (filterService !== 'all') {
      result = result.filter(inv =>
        Array.isArray(inv.service_name) &&
        inv.service_name.flat().includes(filterService)
      );
    }

    setFilteredInvoices(result);
  }, [search, invoiceList, filterStatus, filterPerformer, filterPO, filterPayment, filterService]);


  const handleInvoiceTaxChange = (value) => {
    console.log(value);
    // alert(value);
    setEditInvoice(prev => ({ ...prev, ntax: Number(value) }));
  };


  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      {loading && <Spinner />}
      {/* Filters UI */}
      <div className="mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="mb-2 text-lg font-semibold text-gray-700">Filter Invoices</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="Search Customer Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Type</label>
              <select
                value={filterPerformer}
                onChange={e => setFilterPerformer(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Types</option>
                <option value="yes">Performer Invoice</option>
                <option value="no">Normal Invoice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">PO Number</label>
              <input
                type="text"
                placeholder="Search PO Number..."
                value={filterPO}
                onChange={e => setFilterPO(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Type</label>
              <select
                value={filterPayment}
                onChange={e => setFilterPayment(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Payment Types</option>
                {paymentTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Service</label>
              <select
                value={filterService}
                onChange={e => setFilterService(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Services</option>
                {serviceNames.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <DataTable
        title="Invoice List"
        columns={[
          ...columns
        ]}
        data={filteredInvoices}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="450px"
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader={false}
      />

      {showEditModal && editInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-center">Edit Profile Details</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              {editInvoice.profileName_rate.map((item, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded bg-gray-50 flex flex-col gap-2">

                  {/* Profile Name */}
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

                  {/* Rate */}
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

                  {/* Remark */}
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

              {/* Invoice-level tax radio buttons */}
              {taxlist.length > 0 && (
                <div className="mb-4 p-3 border rounded bg-gray-50">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select Tax for Invoice
                  </label>
                  <div className="flex flex-col gap-2">
                    {taxlist.map((taxes, idx) => (
                      <label key={idx} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="editTax"
                          value={taxes.tax_type}
                          // checked={editInvoice.tax === taxes.tax_type}
                          onChange={() => handleInvoiceTaxChange(taxes.tax_type)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">
                          {taxes.tax}% {taxes.tax_type === 1 ? "(IGST)" : "(SGST 9% + CGST 9%)"}
                        </span>
                      </label>
                    ))}

                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Current selected tax: {editInvoice.tax == 1 ? "18% IGST" : "SGST 9% + CGST 9%"}
                  </div>
                </div>
              )}

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
