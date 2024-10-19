import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { IoPeople,IoDocuments, IoDocumentSharp, IoServerOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

export default function DashboardStatsGrid() {
	const navigation = useNavigate()
	const [loading, setLoading] = useState(false)
    const [customerData, setCustomerData] = useState('')
    const [poData, setPoData] = useState('')
    const [invoiceData, setInvoiceData] = useState('')
    const [serviceData, setServiceData] = useState('')
    const getcustomerList = async () => {
        try{
            setLoading(true);
            const response = await axios.get("/v1/api/totals",{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
			if(response.data.success === true){
				setLoading(false);
				setCustomerData(response.data.customerCount);
				setServiceData(response.data.serviceCount);
				setInvoiceData(response.data.invoiceCount);
				setPoData(response.data.poCount);
			}else{
				setLoading(false);
				setCustomerData('0');
				setPoData('0');
				setInvoiceData('0');
				setServiceData('0');
			}
        }catch(error) {
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
				<div className="pl-4" onClick={() => navigation('/pocreates') }>
					<span className="text-sm text-gray-500 font-light">Total P.O.</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">{poData}</strong>
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