import React, { useEffect,useState } from 'react'
import Services from '../service/Services'
import Spinner from './Spinner'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';

export default function CustomerEditForm({
  setSelectedShowCustomerForm,
  getCountries,
  selectedCustomer
}){
  const alert = useAlert();
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [customername, setCustomerName] = useState("")
  const [gstno, setGSTNo] = useState("")
  const [address, setAddress] = useState("")
  const [open, setGSTYes] =useState(true)

  const [customernameerror, setCustomerNameerror ] = useState("")
  const [gstnoerror, setGSTNoerror ] = useState("")
  const [addresserror, setAddresserror ] = useState("")
  useEffect(()=>{
    setCustomerName(selectedCustomer.name);
    setGSTNo(selectedCustomer.gstno);
    setAddress(selectedCustomer.address);
    getCountries();
  },[]);
  const validation =()=> {
      const errors ={}
      if(customername ===''){
          errors.customername = 'Enter the customer name'
      }
      if(open== true && GSTValidation(gstno) === false){
          errors.gstno = 'Enter the GST OR correct GST Number'
      }if(address ===''){
          errors.address = 'Enter the Address'
      }
      return Object.keys(errors).length===0? null: errors;
  }
  const handlesubmit = (e) =>{
      e.preventDefault();
      const errors = validation();

      if(errors){
        setCustomerNameerror(errors.customername);
        setGSTNoerror(errors.gstno);
        setAddresserror(errors.address);
      }else{
        const data = {
          cname:customername,
          cgst:(gstno)?gstno:'',
          caddress:address
        };
          setLoading(true)
          Services.Common.customer_update(selectedCustomer._id, data).then(function(result) {
            if(result.success === true){
            alert.success(result.message);
            setLoading(false)
            navigation('/')
            // window.location="/customers";
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
                <h3 className="text-2xl font=semibold">New Customer</h3>
              </div>
              <div className="relative p-6">
                <form onSubmit={handlesubmit} className="rounded px-50 pt-6 pb-8 w-full">
                  <label className="block text-black text-sm font-bold mb-1">
                    Customer Name<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="text" name="" 
                  value={customername}
                  onChange={(e)=>{setCustomerName(e.target.value)}}
                  placeholder="Enter Customer Name"
                  className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  <div className='text-red-500 text-sm'>{customernameerror}</div>
                    <label className='block text-black text-sm font-bold mb-1 pt-3'>
                    GST Yes/No<span className="text-red-500">&nbsp;*</span>
                    </label>
                    <div className='text-white-500 text-sm'>
                      <input type='radio' name="gst" onChange={(e)=>{setGSTYes(true) }} defaultChecked /> Yes 
                      <input type='radio' name='gst' onChange={(e)=>{setGSTYes(false) }} style={{marginLeft: '17px'}}/> NO
                    </div>
                  
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                    GST No<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <input type="text" name="" 
                  value={gstno}
                  disabled={open ? false : true }
                  onChange={(e)=>{setGSTNo(e.target.value)}}
                  placeholder="Enter Customer GST No"
                  className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    
                  />
                  <div className='text-red-500 text-sm'>{gstnoerror}</div>
                  <label className="block text-black text-sm font-bold mb-1 pt-3">
                    Address<span className="text-red-500">&nbsp;*</span>
                  </label>
                  <textarea 
                  type="text" name="" 
                  value={address}
                  onChange={(e)=>{setAddress(e.target.value)}}
                  placeholder="Enter Customer Address"
                  className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                <div className='text-red-500 text-sm'>{addresserror}</div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-white bg-red-500 font-bold uppercase px-4 py-2.5 text-sm rounded outline-none focus:outline-none mr-1 mb-1"
                  type="button" onClick={() => setSelectedShowCustomerForm(false)} >
                  Close
                </button>
                <button
                  className="text-white text-bg-color active:text-bg-color font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="submit">
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
function GSTValidation(gstno){
  const regex = "^[0-9]{2}[A-Z]{5}[0-9]{4}"
            + "[A-Z]{1}[1-9A-Z]{1}"
            + "Z[0-9A-Z]{1}$";
        if(!gstno.match(regex)){
          return false
        }else{
          return true
        }
}