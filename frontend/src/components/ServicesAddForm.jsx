import React, { useState } from 'react'
import Services from '../service/Services'
import Spinner from './Spinner'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';


export default function ServicesAddForm({
  setShowServicesForm
}) {
    const navigation = useNavigate()
    const alert = useAlert();
    const [loading, setLoading] = useState(false)
    const [serviceName, setServiceName] = useState("")
    const [SACCode, setSACCode] = useState("")
    //const [price, setPrice] = useState("")
    //const [quantity, setQuantity] = useState("")

    const [serviceNameerror, setServiceNameError] = useState("")
    const [SACCodeerror, setSACCodeError ] = useState("")
    //const [priceerror, setPriceError ] = useState("")
    //const [quantityerror, setQuantityError ] = useState("")

    const validation =()=> {
        const errors ={}
        if(serviceName ===''){
            errors.serviceName = 'Enter the service name'
        }if(SACCode ===''){
            errors.SACCode = 'Enter the SAC Code'
        }
        // if(price ===''){
        //     errors.price = 'Enter the Price'
        // }if(quantity ===''){
        //     errors.quantity = 'Enter the quantity'
        // }
        return Object.keys(errors).length===0? null: errors;
    }
    const handlesubmit = (e) =>{
        e.preventDefault();
        const errors = validation();

        if(errors){
            setServiceNameError(errors.serviceName);
            setSACCodeError(errors.SACCode);
            //setPriceError(errors.price);
            //setQuantityError(errors.quantity);
        }else{
            const data = {
                sname:serviceName,
                scode:SACCode,
                sprice:0,
                sqty:0,
            };
            setLoading(true)
            Services.Common.service_create(data).then(function(result) {
              if(result.success === true){
                alert.success(result.message);
                setLoading(false)
                navigation('/');
                //window.location="/services";
              }
            });
        }
    }
    
  return (
    <div className="container mx-auto mt-6">
      <ToastContainer />
      {loading && <Spinner />}
        <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative" style={{width: '588px'}}>
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-2 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">New Service</h3>
                
              </div>
              <div className="relative p-6">
                <form onSubmit={handlesubmit} className="rounded px-50 pt-6 pb-8 w-full">
                  <label className="block text-black text-sm font-bold mb-1">
                    Service Name<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="text" name="sr_name" 
                  onChange={(e)=>{setServiceName(e.target.value)}} 
                  className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{serviceNameerror}</div>
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                    SAC Codes<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="text" name="sac_code" onChange={(e)=>{setSACCode(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{SACCodeerror}</div>
                  {/*<label className="block text-black text-sm font-bold mb-1 pt-3">
                    Price<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="number" name="price" onChange={(e)=>{setPrice(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{priceerror}</div>
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                    Quantity<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="number" name="qty" onChange={(e)=>{setQuantity(e.target.value)}} className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{quantityerror}
                  </div> */}
              
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-white bg-red-500 font-bold uppercase px-4 py-2.5 text-sm rounded outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowServicesForm(false)}
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
