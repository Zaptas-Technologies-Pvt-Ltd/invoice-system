import React, {useState} from 'react'
import Spinner from './Spinner'
import { useNavigate } from 'react-router-dom';

export default function ReportDownload({setShowDownloadForm}) {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [fromDate, setFromDate] = useState("")
    const [SACCode, setSACCode] = useState("")
    const [toDate, setToDate] = useState("")

    const [fromDateerror, setFromDateError] = useState("")
    //const [SACCodeerror, setSACCodeError ] = useState("")
    const [toDateerror, setToDateError ] = useState("")
    const validation =()=> {
        const errors ={}
        if(fromDate ===''){                                                                            
            errors.fromDate = 'Enter the From date'
        }
        if(toDate === ''){
            errors.toDate = 'Enter the To date'
        }
        // if(SACCode ===''){
        //     errors.SACCode = 'Enter the SAC Code'
        // }
        return Object.keys(errors).length===0? null: errors;
    }
    const handlesubmit = (e) =>{
        e.preventDefault();
        const errors = validation();

        if(errors){
            setFromDateError(errors.fromDate);
           // setSACCodeError(errors.SACCode);
            setToDateError(errors.toDate);
        }else{
            const data = {
                fromDate:fromDate,
                toDate:toDate,
                SACCode:SACCode,
            };
          navigate("api/invoice/download?fromdate="+fromDate+"&todate="+toDate);
            // Services.Common.service_create(data).then(function(result) {
            //     window.location = "/services";
            // });
       }
    }
  return (
    <div className="container mx-auto mt-6">
        {loading && <Spinner />}
        <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative" style={{width: '588px'}}>
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-2 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">Download Report</h3>
                
              </div>
              <div className="relative p-6">
                <form onSubmit={handlesubmit} className="rounded px-50 pt-6 pb-8 w-full">
                  <label className="block text-black text-sm font-bold mb-1">
                    From Date
                  </label>
                  <input type="date" name="" onChange={(e)=>{setFromDate(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{fromDateerror}</div>
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                     To Date
                  </label>
                  <input type="date" name="" onChange={(e)=>{setToDate(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{toDateerror}</div>
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                    SAC Codes
                  </label>
                  <input type="text" name="" onChange={(e)=>{setSACCode(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  {/* <div className='text-red-500 text-sm'>{SACCodeerror}</div> */}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-white bg-red-500 font-bold uppercase px-4 py-2.5 text-sm rounded outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowDownloadForm(false)}
                >
                  Close
                </button>
                <button
                  className="text-white text-bg-color bg-blue-500 active:text-bg-color font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="submit"
                >
                  Submit
                </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
