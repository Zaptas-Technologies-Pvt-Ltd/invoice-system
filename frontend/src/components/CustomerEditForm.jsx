import React, { useEffect, useState } from 'react'
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
  const [isActive, setIsActive] = useState(true)
  const [open, setGSTYes] = useState(true)

  const [customernameerror, setCustomerNameerror] = useState("")
  const [gstnoerror, setGSTNoerror] = useState("")
  const [addresserror, setAddresserror] = useState("")
  
  useEffect(() => {
    setCustomerName(selectedCustomer.name);
    setGSTNo(selectedCustomer.gstno);
    setAddress(selectedCustomer.address);
    setIsActive(selectedCustomer.isActive !== undefined ? selectedCustomer.isActive : true);
    getCountries();
  }, []);
  
  const validation = () => {
      const errors = {}
      if(customername === ''){
          errors.customername = 'Enter the customer name'
      }
      if(open == true && GSTValidation(gstno) === false){
          errors.gstno = 'Enter the GST OR correct GST Number'
      }
      if(address === ''){
          errors.address = 'Enter the Address'
      }
      return Object.keys(errors).length === 0 ? null : errors;
  }
  
  const handlesubmit = (e) => {
      e.preventDefault();
      const errors = validation();

      if(errors){
        setCustomerNameerror(errors.customername);
        setGSTNoerror(errors.gstno);
        setAddresserror(errors.address);
      } else {
        const data = {
          cname: customername,
          cgst: (gstno) ? gstno : '',
          caddress: address,
          isActive: isActive
        };
        setLoading(true)
        Services.Common.customer_update(selectedCustomer._id, data).then(function(result) {
          if(result.success === true){
            alert.success(result.message);
            setLoading(false)
            navigation('/')
          }
        });
      }
  }

  return (
    <div className="container mx-auto mt-6">
      <ToastContainer />
      {loading && <Spinner />}
      <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                Edit Customer
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setSelectedShowCustomerForm(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <form onSubmit={handlesubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customername">
                    Customer Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="customername"
                    type="text"
                    placeholder="Customer Name"
                    value={customername}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {customernameerror && <p className="text-red-500 text-xs italic">{customernameerror}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gstno">
                    GST No
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="gstno"
                    type="text"
                    placeholder="GST No"
                    value={gstno}
                    onChange={(e) => setGSTNo(e.target.value)}
                  />
                  {gstnoerror && <p className="text-red-500 text-xs italic">{gstnoerror}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="address"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {addresserror && <p className="text-red-500 text-xs italic">{addresserror}</p>}
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setSelectedShowCustomerForm(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Save Changes
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