import React, { useEffect, useState } from 'react'
import Services from '../service/Services'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { format } from 'date-fns';
import 'react-datetime/css/react-datetime.css';
import { useAlert } from "react-alert";
import { HiCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

let curentDate = format(new Date(),'yyyy-MM-dd');

export default function Invoice_Generate() {
  const alert = useAlert();
  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] =useState("")
  const [ServiceID, setServiceID] =useState("")
  const [ServiceName, setServiceName] =useState("")
  const [ServiceSACCode, setServiceSACCode] =useState("")
  const [purchaseorder, setPurchaseOrder] =useState("")
  const [podate, setPodate] =useState("")
  const [taxdata, setTax] =useState("")
  const [ invoiceDate, setInvoiceDate] =useState(curentDate)
  // Error set 
  const [customererror, setCustomerError] =useState("")
  const [purchaseordererror, setPurchaseOrderError ] =useState("")
  //const [podateerror, setPodateError ] =useState("")
  const [invoiceDateerror, setinvoiceDateError ] =useState("")
  const [taxerror, setTaxError ] =useState("")
  const [serviceerror, setServiceError ] =useState("")
  const [profileError, setProfileError ] =useState("")
  //const [profileData, setProfile] =useState([]);
  const [newProfile, setNewProfile] =useState([])

  // const [disabled, setDisabled] =useState(false)
 // Multi Checkbox
    const handleChanges = (index, e, value) => {
      //console.log('Input Val: ',value.profileName)
        const intialObject = poData.find((item,i)=> item.profileName === value.profileName );
        const { checked } = e.target;
        if (checked) {
          //setDisabled(true)
          setNewProfile((old)=>[...old, intialObject]);
        } else {
          setNewProfile((old)=> [...old.filter((e,i) => e.profileName !== value.profileName)]
          );
        }
      };
    const handleRate = (index, e, value) => {
      const newArray = newProfile.map((item, i) => {
        if (item.profileName === value.profileName) {
          return { ...item, [e.target.name]: e.target.value };
        } else {
          return item;
        }
      });
      setNewProfile(newArray);
     }
    const handleRemark = (index, e,value) => {
      const newArray = newProfile.map((item, i) => {
        if (item.profileName === value.profileName) {
          return { ...item, [e.target.name]: e.target.value };
        } else {
          return item;
        }
      });
      setNewProfile(newArray);
     }
  const validation =()=> {
        const errors ={}
        if(customer ===''){
            errors.customer = 'Select the customer'
        }if(purchaseorder ===''){
            errors.purchaseorder = 'Enter the purchase order'
        }if(invoiceDate ===''){
          errors.invoiceDate = 'Select the Date'
        }
        if(taxdata ===''){
            errors.taxdata = 'Enter the tax'
        }
        if(newProfile.length ===0){
          errors.newProfile = 'Select the Profile at leat one!'
        }
        return Object.keys(errors).length===0? null: errors;
    }
  const handlesubmit = (e) =>{
    e.preventDefault();
    const errors = validation();
    if(errors){
        setCustomerError(errors.customer);
        setPurchaseOrderError(errors.purchaseorder);
        //setPodateError(errors.podate);
        setinvoiceDateError(errors.invoiceDate);
        setTaxError(errors.taxdata);
        setServiceError(errors.serviceType);
        setProfileError(errors.newProfile);
    }else{
      var profilesDetails = newProfile; 
      //console.log(profilesDetails)
      var fNameData =ServiceName;
      var SACCodeData = ServiceSACCode;
      var fIDData = ServiceID;
       setLoading(true)
       Services.Invoice.create(customer , fIDData,fNameData,SACCodeData, profilesDetails, taxdata , purchaseorder , podate, invoiceDate, 'Cheque').then(function(result) {
          if(result.success === true){
          setLoading(false)
          alert.success(result.message);
          navigation("/invoices");
          }
     });
    }
}
  const [customerlist, setCustomerList] = useState([]);
  const [poslist, setPOList] =useState([]);
  const [posDetail, setPODetail] =useState([]);
  const getCustomerlist = async () => {
    try{
        const response = await axios.get("/api/customer",{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
        if(response.data.success === true ){
          setCustomerList(response.data.data);
        }else{
          setCustomerList([]);
        }
      }catch(error) {
          console.log(error);
         // setProfile({data:[]});
      }
  };
  
  useEffect(() => {
    getCustomerlist();
    getPOlist();
    getPODetails();
  }, []);

  const getPOlist = async (e) => {
    try{
        setCustomer(e)
        const response = await axios.get("/api/poList/"+e,{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
        if(response.data.success === true){
          setPOList(response.data.data);
        }else{
          setPOList([]);
        }
    }catch(error) {
      console.log(error);
       setPOList("");
      // setProfile({data:[]});
    }
  };
  const [poData, setPoData] = useState("");
  const getPODetails = async (e) => {
    try{
        
        const response = await axios.get("/api/poDetail/"+e,{ headers: {"authorization" : `Bearer ${localStorage.getItem('token')}`} });
        //console.log(response.data.data == null)
        if(response.data.data !== null){
         // setProfile({data:[]});
          setPODetail(response.data.data);
          setTax(response.data.data[0].taxtype);
          setPodate(response.data.data[0].podate);
          setServiceID(response.data.data[0].serviceid);
          setServiceName(response.data.data[0].servicename);
          setServiceSACCode(response.data.data[0].servicecode);
          setPurchaseOrder(response.data.data[0].pono)
          setPoData(response.data.data[0].polistdata)
        }else{
          //setPODetail("");
          //alert.error('Sorry PO Not Available!');
        }
    }catch(error) {
        console.log(error);
        setPODetail('');
        setTax('');
        setPodate('');
        setServiceID('');
        setServiceName('');
        setServiceSACCode('');
        setPurchaseOrder('');
        //setProfile({data:[]});
    }
  };
  
  //console.log(poData)
  // useEffect(() => {  
  //   getPODetails();
  // },[])
  //console.log(posDetail[0]?.servicename)
 // console.log(customerlist)
  return (
    <div className="container mx-auto">
      <ToastContainer />
      {loading && <Spinner />}
      <div className='card p-3'>
        <h1 className='text-lg'> Affiliate PO Details (Invoice Create)</h1>
        <hr />
        <form onSubmit={handlesubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-3 mt-6">
          <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Customer</label>
            <select onChange={(e)=>{getPOlist(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>Choose your customer..</option>
              {customerlist.map(customer => (
                    <option key={customer._id} value={customer._id}>{customer.name}</option>
                ))}
              </select>
              <div className='text-red-500 text-sm'>{customererror}</div>
          </div>
          <div>
            <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select PO</label>
            <select onChange={(e)=>{getPODetails(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>Choose your PO..</option>
              {(poslist.length !==0)?
              poslist?.map(po => (
                    <option key={po._id} value={po._id}>{po.pono}</option>
                )):''}
              </select>
            <div className='text-red-500 text-sm'>{purchaseordererror}</div>
          </div>
          <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invoice Date</label>
            <input type="date" 
             //max={moment().format("YYYY-MM-DD")}
             value={invoiceDate}
             //value={podate}
            //onChange={(e)=>{setPodate(e.target.value)}} 
            onChange={(e)=>{setInvoiceDate(e.target.value)}} 
            id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[14rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <div className='text-red-500 text-sm ml-24'>{invoiceDateerror}</div>
          </div>
          <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selected Tax</label>
            <label className="inline-flex items-center">
              { (posDetail[0]?.taxtype >0) ? 
                <input type="hidden" 
                onChange={(e)=>{setTax(e.target.value)}} 
                value={taxdata} 
                className="form-radio" name="accountType" checked />
               :'' } 
              { (posDetail[0]?.taxtype >0) ?<span className="ml-1 mr-2"><HiCheck /></span>:'' }
              { (posDetail[0]?.taxtype >0) ?<span className="ml-2 mr-3">{ (posDetail[0]?.taxtype === 1)?'18':'18'}% { (posDetail[0]?.taxtype === 1) ? '(IGST)': '(SGST 9% + CGST 9%)'}</span>
              : '' }
            </label>
            <div className='text-red-500 text-sm'>{taxerror}</div>
          </div>
          <div className='w-[40rem]'>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Details</label>
            {(posDetail.length !==0)?
             posDetail[0].servicename.map(service=> (
              <label className="inline-flex items-center">
                <input type="hidden" name="serviceName"
                 //onChange={(e) => getServicesValues(e)}
                // onChange={handleChange}
                 //value={service._id+','+service.sr_name+','+service.sac_code}
                className="form-checkbox" checked  />
                <span className="ml-1 mr-2"><HiCheck /></span>
                <span className="ml-1 mr-2">{service}</span>
              </label>
            ))
             :'' }
            <div className='text-red-500 text-sm'>{serviceerror}</div>
          </div>
          <div></div>
            <div className="flex w-[60rem] mb-6 md:grid-cols-3 mt-6">
              <div>
              <p style={{color:'red',fontStyle:'italic'}}>First click on the checkbox then change the amount & remark.**</p>
              <div className="flex">
                <div className='w-[21rem]'>
                  <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select PO Details</label>
                </div>
                <div className='w-[21rem]'>
                  <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PO Rate</label>
                </div>
                <div>
                  <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PO Remark</label>
                </div>
              </div>
             { (poData.length !==0)? 
              poData.map((value, index)=> (
                <div className="flex" key={index}>
                  <div className='w-[21rem]' key={index}>
                    <input type="checkbox" 
                    id={`ProfileName-${index}`}
                    name="ProfileName"
                    value={value.profileName || ''}
                    onChange={e => handleChanges(index, e, value)}
                    //onChange={handleInputChange}
                    className="form-checkbox" />
                    <span className="ml-1 mr-3">{value.profileName}</span>
                    <div className='text-red-500 text-sm'>{profileError}</div>
                  </div>
                  <div className='w-[21rem]'key={index}>
                    <input 
                      type="number"
                      id={`rate-${index}`}
                      name="rate"
                      //value={value.rate || ''}
                      defaultValue={value.rate || ''}
                      onChange={e => handleRate(index, e, value)}
                      //onChange={(e)=>{setNewRate(e.target.value)}} 
                      className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter The Amount" />
                  </div>
                  <div key={index}>
                    <input 
                    type="text"
                    id={`remark-${index}`}
                    name="remark"
                    onChange={e => handleRemark(index, e, value)}
                    //onChange={(e)=>{setRemark(e.target.value)}} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter The Remark" />
                  </div>
              </div>
              ))
              :''}
            </div>
            
          </div>
        </div>
          <div className="button-section">
            <button type="submit" 
            className="flex flex-nowrap text-white text-bg-color active:bg-purple-200 font-bold uppercase text-sm px-4 py-2.5 rounded w-[10rem] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">Invoice Create</button>
        </div>
      </form>
    </div>
    </div>
  )
}
 