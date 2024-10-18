import React, {useEffect, useState } from 'react'
import Spinner from './Spinner'
import Services from '../service/Services'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {GetLoginUserDetails} from '../helper/GetLoginUserDetails'
import { useAlert } from "react-alert";
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function ChangePassword() {
 // const {id} = useParams();
  const alert = useAlert();
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState("")
  const [isVisible, setVisible] = useState(false);
  const [isVisible1, setVisible1] = useState(false);
  const [ oldPassword, setOldPassword] = useState("")
  const [ newPassword, setNewPassword] = useState("")
 
  const [ oldPasswordError, setOldPasswordError] = useState("")
  const [ newPasswordError, setNewPasswordError] = useState("")
  
  const toggle = () => {
    setVisible(!isVisible);
    
  };
  const toggle1 = () => {
    setVisible1(!isVisible1);
  };

  const validation =()=> {
    const errors ={}
    if(oldPassword ===''){
        errors.oldPassword = 'Enter the old password'
    }if(newPassword ===''){
        errors.newPassword = 'Enter the new password'
    }
    return Object.keys(errors).length===0? null: errors;
}
  const handlesubmit = (e) =>{
    e.preventDefault();
    const errors = validation();

    if(errors){
        setOldPasswordError(errors.oldPassword);
        setNewPasswordError(errors.newPassword);
    }else{
        const data = {
            password:oldPassword,
            newpassword:newPassword,
        };
        if(id){
            setLoading(true)
            Services.Common.password_update(id,data).then(function(result) {
                if(result.success === true){
                alert.success(result.message);
                setLoading(false)
                navigation('/');
                }else{
                alert.error(result.message);
                setLoading(false)
                navigation('/changepass');
                }
            });
        }
    }
}
useEffect(() => {
  //localStorage.setItem("token",id);
  GetLoginUserDetails().then(function(result){
    setID(result._id)
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
                <div className="col-span-5 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Enter Old Password<span className="text-red-500">&nbsp;*</span></label>
                  <input type={!isVisible ? "password" : "text"} name="password"
                  onChange={(e)=>{setOldPassword(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  <div className="icon" style={{position:'absolute', marginTop:'-28px', marginLeft:'277px'}} onClick={toggle}>
                    {isVisible ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                  </div>
                <div className='text-red-500 text-sm'>{oldPasswordError}</div>
                </div>
                <div className="col-span-5 sm:col-span-5 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Enter New Password<span className="text-red-500">&nbsp;*</span></label>
                  <input type={!isVisible1 ? "password" : "text"} name="newpassword" 
                  onChange={(e)=>{setNewPassword(e.target.value)}} 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  <div className="icon" style={{position:'absolute', marginTop:'-28px', marginLeft:'277px'}} onClick={toggle1}>
                    {isVisible1 ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                  </div>
                  <div className='text-red-500 text-sm'>{newPasswordError}</div>
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

