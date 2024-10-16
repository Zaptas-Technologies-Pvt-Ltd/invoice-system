import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { IoPeople,IoDocuments, IoDocumentSharp, IoServerOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

export default function DashboardStatsGrid() {
	const navigation = useNavigate()
	const [loading, setLoading] = useState(false)
    const [customerData, setCustomerData] = useState('')
    const [reportData, setReportData] = useState('')
    const [invoiceData, setInvoiceData] = useState('')
    const [serviceData, setServiceData] = useState('')
	const getcustomerList = async () => {
		try {
		  setLoading(true);
	  
		  // Retrieve the token from localStorage
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
	  
		  // Make multiple API requests with the same headers
		  const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/customer", config);
		  const response1 = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/getInvoice", config);
		  const response2 = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/getInvoice", config); // This seems to be a duplicate, consider removing one if not needed
		  const response3 = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/services", config);
	  
		  setLoading(false);
	  
		  // Set the response data
		  setCustomerData(response.data.length);
		  setReportData(response1.data.length);
		  setInvoiceData(response2.data.length); // Same response as response1
		  setServiceData(response3.data.length);
	  
		} catch (error) {
		  setLoading(false);
		  console.log(error);
		}
	  };
	  
    useEffect(() => {
        getcustomerList()
    }, []);
	return (
		<div className="flex gap-4">
			{loading && <Spinner />}
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
					<IoPeople className="text-2xl text-white" />
				</div>
				<div className="pl-4" onClick={() => navigation('/customers') }>
					<span className="text-sm text-gray-500 font-light">Total Customer's</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{customerData}</strong>
						{/* <span className="text-sm text-green-500 pl-2">+343</span> */}
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
					<IoServerOutline className="text-2xl text-white" />
				</div>
				<div className="pl-4" onClick={() => navigation('/services') }>
					<span className="text-sm text-gray-500 font-light">Total Services</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{serviceData}</strong>
						{/* <span className="text-sm text-green-500 pl-2">-343</span> */}
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
					<IoDocumentSharp className="text-2xl text-white" />
				</div>
				<div className="pl-4" onClick={() => navigation('/invoices') }>
					<span className="text-sm text-gray-500 font-light">Total Invoice</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{invoiceData}</strong>
						{/* <span className="text-sm text-red-500 pl-2">-30</span> */}
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<IoDocuments className="text-2xl text-white" />
				</div>
				<div className="pl-4" onClick={() => navigation('/reports') }>
					<span className="text-sm text-gray-500 font-light">Total Reports</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{reportData}</strong>
						{/* <span className="text-sm text-red-500 pl-2">-43</span> */}
					</div>
				</div>
			</BoxWrapper>
		</div>
	)
}

function BoxWrapper({ children }) {
	return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}