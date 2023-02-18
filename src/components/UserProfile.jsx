import React, {useEffect, useState } from 'react'
import Spinner from './Spinner'
import Services from '../service/Services'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import validation from '../helper/CheckValidation'
import { useNavigate, useParams } from 'react-router-dom';
import {GetLoginUserDetails} from '../helper/GetLoginUserDetails'
import { useAlert } from "react-alert";

export default function UserProfile() {
 // const {id} = useParams();
  const alert = useAlert();
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState("")
  const [userName, setUserName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyGSTNo, setCompanyGSTNo] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setAccountNumber] = useState("")
  const [ifsccode, setIfscCode] = useState("")

  const [userNameError, setUserNameError] = useState("")
  const [companyNameError, setCompanyNameError] = useState("")
  const [companyAddressError, setCompanyAddressError] = useState("")
  const [companyGSTNoError, setCompanyGSTNoError] = useState("")
  const [bankNameError, setBankNameError] = useState("")
  const [accountNumberError, setAccountNumberError] = useState("")
  const [ifsccodeError, setIfscCodeError] = useState("")
  const validation =()=> {
    const errors ={}
    if(userName ===''){
        errors.userName = 'Enter the User name'
    }if(companyName ===''){
        errors.companyName = 'Enter the Company Name'
    }if(companyAddress ===''){
        errors.companyAddress = 'Enter the Company Address'
    }if(GSTValidation(companyGSTNo) === false){
        errors.companyGSTNo = 'Enter the Valid GST No.'
    }if(bankName ===''){
      errors.bankName = 'Enter the Bank Name'
    }
    // if(!bankAccountNumber.match('^[0-9]{12}$')){
    //     errors.accountNumber = 'Enter the Valid Account Number'
    // }
    // if(bankAccountNoValidation(bankAccountNumber) === false){
    //   errors.bankAccountNumber = 'Enter the Valid Account Number'
    // }
    if(ifscCodeValidation(ifsccode) ===false){
      errors.ifsccode = 'Enter the Valid IFSC Code'
    }
    return Object.keys(errors).length===0? null: errors;
}
  const handlesubmit = (e) =>{
    e.preventDefault();
    const errors = validation();

    if(errors){
      setUserNameError(errors.userName);
      setCompanyNameError(errors.companyName);
      setCompanyAddressError(errors.companyAddress);
      setCompanyGSTNoError(errors.companyGSTNo);
      setBankNameError(errors.bankName);
      setAccountNumberError(errors.bankAccountNumber);
      setIfscCodeError(errors.ifsccode);
    }else{
        const data = {
         // id :localStorage.getItem('token'),
          userName:userName,
         // password: ,
          companyName:companyName,
          companyAddress:companyAddress,
          companyGST:companyGSTNo,
          bankName: bankName,
          accountNumber: bankAccountNumber,
          ifscCode: ifsccode,

        };
        //let id =localStorage.getItem('token');
        if(id){
          setLoading(true)
          Services.Common.profile_update(id,data).then(function(result) {
          if(result.success == true){
            alert.success(result.message);
            setLoading(false)
            navigation('/');
          }
          });
        }else{
        setLoading(true)
        Services.Common.profile_create(data).then(function(result) {
        if(result.success == true){
          alert.success(result.message);
          setLoading(false)
          navigation('/');
          }
        });
       
    }}
   
}
useEffect(() => {
  //localStorage.setItem("token",id);
  GetLoginUserDetails().then(function(result){
    setID(result._id)
    setUserName(result.userName)
    setCompanyName(result.companyName)
    setCompanyAddress(result.companyAddress)
    setCompanyGSTNo(result.companyGST)
    setBankName(result.bankName)
    setAccountNumber(result.accountNumber)
    setIfscCode(result.ifscCode)
  })
},[]);
  return (
  <div className="mt-18 ml-8 mr-8 sm:mt-0">
    <div className="md:grid md:grid-cols-3 md:gap-6">
      {loading && <Spinner />}
      <div className="mt-2 md:mt-0 md:col-span-12">
      <form onSubmit={handlesubmit}>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">User name<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="userName" 
                  value={userName}
                  disabled
                  onChange={(e)=>{setUserName(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{userNameError}</div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Company Name<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="companyName"
                  value={companyName}
                  disabled
                  onChange={(e)=>{setCompanyName(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{companyNameError}</div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Company address<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="companyAddress" 
                  value={companyAddress}
                  onChange={(e)=>{setCompanyAddress(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{companyAddressError}</div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Company GST Number<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="companyGSTno" 
                  value={companyGSTNo}
                  disabled
                  onChange={(e)=>{setCompanyGSTNo(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{companyGSTNoError}</div>
                </div>
                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bank Name<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="bankName" 
                  value={bankName}
                  onChange={(e)=>{setBankName(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{bankNameError}</div>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Account Number(Only Number)<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="accountNumber" 
                  value={bankAccountNumber}
                  maxlength="17"
                  pattern="^[0-9]{17}$"
                  onChange={(e)=>{setAccountNumber(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{accountNumberError}</div>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">IFSC<span className="text-red-500">&nbsp;*</span></label>
                  <input type="text" name="ifscCode" 
                  value={ifsccode}
                  onChange={(e)=>{setIfscCode(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                <div className='text-red-500 text-sm'>{ifsccodeError}</div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button onClick={() => navigation('/') } className="text-white text-bg-back-color  bg-blue-700 active:text-bg-color font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="submit">
                    Go Back
              </button>
              <button className="text-white text-bg-color bg-blue-500 active:text-bg-color font-bold uppercase text-sm px-4 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="submit">
                    Submit
              </button>
            </div>
          </div>
          </form>
      </div>
    </div>
  </div>
  )
}
function GSTValidation(companyGSTNo){
  const regex = "^[0-9]{2}[A-Z]{5}[0-9]{4}"
            + "[A-Z]{1}[1-9A-Z]{1}"
            + "Z[0-9A-Z]{1}$";
        if(!companyGSTNo.match(regex)){
          return false
        }else{
          return true
        }
}
function ifscCodeValidation(ifsccode){
  const regex = /^[A-Za-z]{4}\d{7}$/
      if(!ifsccode.match(regex)){
      return false
      }else{
      return true
      }
}
function bankAccountNoValidation(bankAccountNumber){
  const regex = /^[0-9]{16}$/
      if(!bankAccountNumber.match(regex)){
      return false
      }else{
      return true
      }
}
