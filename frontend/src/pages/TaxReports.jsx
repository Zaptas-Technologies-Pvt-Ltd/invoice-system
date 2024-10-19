import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import TaxReportList from '../components/TaxReportList'
import moment from 'moment';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const date = new Date();
let prevStartDate = format(new Date(date.getFullYear(),date.getMonth() - 1, 1),'yyyy-MM-dd');
let preEndDate = format(new Date(date.getFullYear(),date.getMonth() - 1 + 1, 0),'yyyy-MM-dd');

//const futureDate = date.getDate() + 3;
//date.setDate(futureDate);
//const defaultValue = date.toLocaleDateString('en-CA');
//console.log(Moment(prevStartDate).locale('en').format('dd-MM-yyyy'))
export default function TaxReports() {
    const navigation =useNavigate()
    const [loading, setLoading] = useState(false)
    const [SACCode, setSACCode] = useState([])
    //const [FromDates, setFromDate] = useState(Moment(prevStartDate).format('DD-MM-YYYY'))
    const [FromDates, setFromDate] = useState(prevStartDate)
    const [ToTODates, setToTODate] = useState(preEndDate)
    const [SACCodeFilts, setSACCodeFilt] = useState([])
    const [resetForm, setResetForm] = useState(false)
    
    const getSACCode = async () => {
        try{
            setLoading(true)
            const response = await axios.get("/v1/api/services",{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
            if(response.data.success ===true){
                setLoading(false)
                setSACCode(response.data.data);
            }else{
                setLoading(false)
                setSACCode([]);
            }
        }catch(error) {
            setLoading(false)
            console.log(error);
        }
    };
    const handleSubmit = (e) =>{
        e.preventDefault();
        e.target.reset();
       navigation("/reports");
        setFromDate('');
        setToTODate('');
        setSACCodeFilt('');
        setResetForm(true);
    }
    
    const exportInvoiceAll = async()=>{
        const response = await axios.get('/v1/api/exportExcelxlsxAll?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts);
        if(response.status === 200){
            window.open('/v1/api/exportExcelxlsxAll?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts+'',"blank")
        }else{
            console.log('error');
        }
      }
      const exportInvoiceTaxReport = async()=>{
        const response = await axios.get('/v1/api/exportExcelxlsxTaxReport?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts);
        //console.log(response)
        if(response.status === 200){
            window.open('/v1/api/exportExcelxlsxTaxReport?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts+'',"blank")
        }
        else{
            console.log('error');
        }
      }
      const exportInvoiceSACCode = async()=>{
        const response = await axios.get('/v1/api/exportExcelxlsxSACCode?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts);
       // console.log(response.data)
        if(response.status === 200){
            // const blob = new Blob([response.data], {
            //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            //   });
            //   saveAs(blob, "file.xlsx");
            // const blob = new Blob([response.data], {
            //     type:
            //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            //   });
            window.open('/v1/api/exportExcelxlsxSACCode?fromdate='+FromDates+'&todate='+ToTODates+'&saccode='+SACCodeFilts+'',"blank")
        }else{
            console.log('error');
        }
      }
      
    useEffect(() => {
        getSACCode()
    },[]);
    // const handleChange = e => {
    //     setFromDate(e.target.value)
    //   }
  return (
    <div className="flex flex-col gap-4 w-full">
        {loading && <Spinner />}
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
                    {SACCode.map( saccode => (
                        <option value={saccode.sac_code} key={saccode.sac_code}>{saccode.sac_code}</option>
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
        </div>
        </form>
        <TaxReportList FromDate={FromDates} ToTODate={ToTODates} SACCodeFilt={SACCodeFilts} resetForm={resetForm} />
    </div>
  )
}