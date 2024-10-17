import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TaxReportList from '../components/TaxReportList'
import moment from 'moment';
import { format } from 'date-fns';
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';

const date = new Date();
let prevStartDate = format(new Date(date.getFullYear(),date.getMonth() - 1, 1),'yyyy-MM-dd');
let preEndDate = format(new Date(date.getFullYear(),date.getMonth() - 1 + 1, 0),'yyyy-MM-dd');

export default function TaxReports() {
    const navigate = useNavigate();
    const alert = useAlert();
    const [loading, setLoading] = useState(false)
    const [SACCode, setSACCode] = useState([])
    const [FromDates, setFromDate] = useState(prevStartDate)
    const [ToTODates, setToTODate] = useState(preEndDate)
    const [SACCodeFilts, setSACCodeFilt] = useState([])
    const [resetForm, setResetForm] = useState(false)
    
    const getSACCode = async () => {
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
            const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/services",config);
            setLoading(false)
            setSACCode(response.data.data);
        }catch(error) {
            setLoading(false)
            console.log(error);
        }
    };
    const handleSubmit = (e) =>{
        e.preventDefault();
        e.target.reset();
       navigate("/reports");
        setFromDate('');
        setToTODate('');
        setSACCodeFilt('');
        setResetForm(true);
    }
    
    const exportInvoiceAll = async()=>{
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
        const response = await axios.get('https://invoice-system-h9ds.onrender.com/v1/api/exportExcelxlsxAll?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts,config);
        if(response.status === 200){
            window.open('https://invoice-system-h9ds.onrender.com/api/exportExcelxlsxAll?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts+'',"blank")
        }else{
            console.log('error');
        }
      }
      const exportInvoiceTaxReport = async()=>{
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
        const response = await axios.get('https://invoice-system-h9ds.onrender.com/v1/api/exportExcelxlsxTaxReport?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts,config);
        console.log(response)
        if(response.status === 200){
            window.open('https://invoice-system-h9ds.onrender.com/api/exportExcelxlsxTaxReport?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts+'',"blank")
        }
        else{
            console.log('error');
        }
      }
      const exportInvoiceSACCode = async()=>{
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
        const response = await axios.get('https://invoice-system-h9ds.onrender.com/v1/api/exportExcelxlsxSACCode?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts,config,{
            responseType: 'blob' 
        });
       // console.log(response.data)
       if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoiceSACCode_${FromDates}_to_${ToTODates}.xlsx`); // Set the file name
        document.body.appendChild(link);
        link.click();  // Trigger the download
        link.remove(); // Clean up
    }else{
            console.log('error');
        }
      }
      
    useEffect(() => {
        getSACCode()
        //setFromDate(prevStartDate)
       // setToTODate(preEndDate)
    },[]);
    const handleChange = e => {
        setFromDate(e.target.value)
      }
  return (
    <div className="flex flex-col gap-4 w-full">
        {/* {loading && <Spinner />} */}
        <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex gap-4 items-center">
            <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">From Date: </label>
                <input type="date"
                max={moment().format("YYYY-MM-DD")}
                //name='dateRequired'
                value={FromDates}
               // id="dateRequired"
                //defaultValue ={FromDates}
                onChange={(e)=>{setFromDate(e.target.value)}}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">To Date: </label>
                <input type="date"
                value={ToTODates}
                onChange={(e)=>{setToTODate(e.target.value)}}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Select SAC Code: </label>
                <select 
                onChange={(e)=>{setSACCodeFilt(e.target.value)}} 
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 px-12  py-2.5 rounded-md" >
                    <option value=''>Select SAC Code..</option>
                    {SACCode && SACCode?.map( saccode => (
                        <option value={saccode.sac_code}>{saccode.sac_code}</option>
                    ))}
                </select>
            </div>
            <div className="col-span-6 sm:col-span-3 mt-4">
                <label className="block text-sm font-medium text-gray-700"></label>
                <button className="text-white bg-red-500 bg-blue-500 active:bg-red-500 font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="submit" style={{backgroundColor:'#e36a6a'}}
                    >
                    Reset
              </button>
            </div>
            </div>
            <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex gap-4 items-center">
                <div className="col-span-4 sm:col-span-1 mt-4">
                    <label className="block text-sm font-medium text-gray-700"></label>
                    <button className="text-white text-bg-color bg-blue-500 active:text-bg-color font-bold uppercase text-sm px-3 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={exportInvoiceAll}>
                        Download All
                </button>
                </div>
                <div className="col-span-1 sm:col-span-1 mt-4">OR</div>
                <div className="col-span-4 sm:col-span-1 mt-4">
                    <label className="block text-sm font-medium text-gray-700"></label>
                    <button className="text-white text-bg-color bg-blue-500 active:text-bg-color font-bold uppercase text-sm px-3 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={exportInvoiceTaxReport}>
                        Download Tax Report
                </button>
                </div>
                <div className="col-span-1 sm:col-span-1 mt-4">OR</div>
                <div className="col-span-4 sm:col-span-1 mt-4">
                    <label className="block text-sm font-medium text-gray-700"></label>
                    <button className="text-white text-bg-color bg-blue-500 active:text-bg-color font-bold uppercase text-sm px-3 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={exportInvoiceSACCode}>
                        Download SAC Code
                </button>
                </div>
            {/*  */}
        </div>
        </form>
        <TaxReportList FromDate={FromDates} ToTODate={ToTODates} SACCodeFilt={SACCodeFilts} resetForm={resetForm} />
    </div>
  )
}