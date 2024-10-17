import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import Services from '../service/Services';
import { useAlert } from "react-alert";
import POCreatedList from '../components/POCreatedList';
import { useNavigate } from 'react-router-dom';

export default function POCreate() {
  const navigate = useNavigate();
  const alert = useAlert();
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] =useState("")
  const [purchaseorder, setPurchaseOrder] =useState("")
  const [podate, setPodate] =useState("")
  const [taxdata, setTax] =useState("")
  const [serviceType, setService] =useState({
    languages: [],
    response: [],
  });
  const [serviceRadioType, setRadioService] =useState("");
  const [customererror, setCustomerError] =useState("")
  const [purchaseordererror, setPurchaseOrderError ] =useState("")
  const [podateerror, setPodateError ] =useState("")
  const [taxerror, setTaxError ] =useState("")
  const [serviceerror, setServiceError ] =useState("")

  const [formValues, setFormValues] = useState([{ profileName: "", rate : "", remark : ""}])

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }
  let addFormFields = () => {
      setFormValues([...formValues, { profileName: "", rate: "", remark : "" }])
  }
  let removeFormFields = (i) => {
      let newFormValues = [...formValues];
      newFormValues.splice(i, 1);
      setFormValues(newFormValues)
  }

 // Multi Checkbox
 const handleChanges = (e) => {
  // Destructuring
  const { value, checked } = e.target;
  const { languages } = serviceType;
  // Case 1 : The user checks the box
  if (checked) {
    setService({
      languages: [...languages, value],
      response: [...languages, value],
    });
  }
  // Case 2  : The user unchecks the box
  else {
    setService({
      languages: languages.filter((e) => e !== value),
      response: languages.filter((e) => e !== value),
    });
  }
};
const validation =()=> {
  const errors ={}
  if(customer ===''){
      errors.customer = 'This field cannot be left blank'
  }if(purchaseorder ===''){
      errors.purchaseorder = 'This field cannot be left blank'
  }if(podate ===''){
      errors.podate = 'This field cannot be left blank'
  }
  if(taxdata ===''){
      errors.taxdata = 'Select the tax'
  }
  if(serviceRadioType ===''){
    errors.serviceRadioType = 'Select the service'
  }
  return Object.keys(errors).length===0? null: errors;
}
const handleSubmit = (e) =>{
  e.preventDefault();
  const errors = validation();

  if(errors){
      setCustomerError(errors.customer);
      setPurchaseOrderError(errors.purchaseorder);
      setPodateError(errors.podate);
      setTaxError(errors.taxdata);
      setServiceError(errors.serviceRadioType);
  }else{
    var serviceFind ='';
    var serviceIDs = '';
    var serviceSACCode = '';
    var serviceName ='';
    var fIDData='';
    var fNameData = '';
    // this functionality use for cehckbox in service
   /* serviceType.languages.map(item => {
      serviceFind = item.split(',')
        serviceIDs = serviceFind[0]?serviceIDs.concat(',',serviceFind[0]):''
        serviceName = serviceName.concat(',',serviceFind[1])
        serviceSACCode = serviceSACCode.concat(',',serviceFind[2])
    })
    var array1 =serviceIDs.split(',');
    var array2 =serviceName.split(',');
    var array3 =serviceSACCode.split(',');
    const newArr = array1.filter((a) => a);
    const newArr1 = array2.filter((b) => b);
    const newArr2 = array3.filter((c) => c);
    var fNameData =newArr1;
    var SACCodeData = newArr2;
    var fIDData = newArr;*/
   // this functionality use for radio in service
    var fNameData =serviceRadioType.split(',')[1];
    var SACCodeData = serviceRadioType.split(',')[2];
    var fIDData = serviceRadioType.split(',')[0];
    var polistData = formValues;
      setLoading(true)
      Services.poCreate.create(customer,fIDData,fNameData,SACCodeData,
        polistData,taxdata,purchaseorder,podate
        ).then(function(result) {
        if(result.success == true){
          setLoading(false)
          alert.success(result.message);
         navigate("/pocreates");
        }
   });
  }
}
  const [customerlist, setCustomerList] = useState([]);
  const [servicelist, setServiceList] = useState([]);
  const [taxlist, settaxList] = useState([]);
  const getCustomerlist = async () => {
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
        const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/customer",config);
        setCustomerList(response.data.data);
      }catch(error) {
          console.log(error);
      }
  };
  const getServicelist = async () => {
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
        const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/services",config);
        setServiceList(response.data.data);
    }catch(error) {
        console.log(error);
    }
  };
  const getTaxlist = async () => {
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
        const response = await axios.get("https://invoice-system-h9ds.onrender.com/v1/api/tax",config);
        settaxList(response.data.data);
    }catch(error) {
        console.log(error);
    }
  };

  useEffect(() => {
    getCustomerlist();
    getServicelist();
    getTaxlist();
  }, []);
  return (
    <div className="flex flex-col gap-4 w-full">
      {loading && <Spinner />}
      <div className='card p-3'>
        <h1 className='text-lg'> Affiliate Client Details (P.O. Create)</h1>
        <hr />
        <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-3 mt-6">
          <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Customer</label>
            <select onChange={(e)=>{setCustomer(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>Choose your customer..</option>
              {customerlist.map(customer => (
                    <option key={customer._id} value={customer._id}>{customer.name}</option>
                ))}
              </select>
              <div className='text-red-500 text-sm'>{customererror}</div>
          </div>
          <div>
            <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PO Number</label>
            <input type="text" onChange={(e)=>{setPurchaseOrder(e.target.value)}} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[24rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Purchase Order" />
            <div className='text-red-500 text-sm'>{purchaseordererror}</div>
          </div>
          <div>
            <label for="last_name" className="ml-24 block mb-2 text-sm font-medium text-gray-900 dark:text-white">PO Date</label>
            <input type="date" 
             max={moment().format("YYYY-MM-DD")}
            onChange={(e)=>{setPodate(e.target.value)}} 
            id="last_name" className="ml-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[14rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <div className='text-red-500 text-sm ml-24'>{podateerror}</div>
          </div>
          <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Tax</label>
            {taxlist.map(taxes => (
            <label className="inline-flex items-center">
              <input type="radio" onChange={(e)=>{setTax(e.target.value)}} value={taxes.tax_type} className="form-radio" name="accountType" />
              <span className="ml-1 mr-3">{taxes.tax}% { (taxes.tax_type == 1) ? '(IGST)': '(SGST 9% + CGST 9%)'}</span>
            </label>
            ))}
            <div className='text-red-500 text-sm'>{taxerror}</div>
          </div>
          <div className='w-[40rem]'>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Services Details</label>
            {servicelist.map(service=> (
              <label className="inline-flex items-center">
                <input type="radio" name="serviceName"
                 //onChange={(e) => getServicesValues(e)}
                 onChange={(e)=>{setRadioService(e.target.value)}}
                 value={service._id+','+service.sr_name+','+service.sac_code} className="form-radio"  />
                <span className="ml-1 mr-3">{service.sr_name}</span>
              </label>
            //   <label className="inline-flex items-center">
            //   <input type="radio" name="serviceName"
            //    //onChange={(e) => getServicesValues(e)}
            //    onChange={handleChanges}
            //    value={service._id+','+service.sr_name+','+service.sac_code} className="form-checkbox"  />
            //   <span className="ml-1 mr-3">{service.sr_name}</span>
            // </label>
            ))}
            <div className='text-red-500 text-sm'>{serviceerror}</div>
          </div>
          </div>
          <div></div>
          <div className="mb-6 md:grid-cols-3 mt-6">
          <div className="flex">
            <div className='w-[21rem]'>
              <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Name</label>
            </div>
            <div className=''>
              <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rate</label>
            </div>
          </div>
          {formValues.map((element, index) => (
            <div className="flex" key={index}>
                <div>
                  <input 
                  type="text"
                  name='profileName'
                  value={element.profileName || ""} 
                  onChange={e => handleChange(index, e)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter profile name....' />
                  <div className='text-red-500 text-sm'>{customererror}</div>
                </div>
                <div>
                  <input 
                  type="text" 
                  name='rate'
                  value={element.rate || ""} 
                  onChange={e => handleChange(index, e)}
                  className="ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[15rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the rate..." />
                  <div className='text-red-500 text-sm'>{purchaseordererror}</div>
                </div>
                <div>
                  <div className='mt-2'>
                    {
                      formValues.length!==1 &&
                        <button type="button" style={{fontSize:30}} className="button remove" onClick={() => removeFormFields(index)}><HiMinusCircle /></button> 
                    }
                    { formValues.length-1===index &&
                      <button className="button add" style={{fontSize:30}} type="button" onClick={() => addFormFields()}><HiPlusCircle /></button>  
                    }
                  </div>
                </div>
            </div>
          ))}
        </div>
        <div className="button-section">
          <button type="submit" className="flex flex-nowrap text-white text-bg-color active:bg-purple-200 font-bold uppercase text-sm px-4 py-2.5 rounded w-[8rem] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">P.O. Create</button>
        </div>
      </form>
    </div>
        <POCreatedList />
    </div>
  )
}
