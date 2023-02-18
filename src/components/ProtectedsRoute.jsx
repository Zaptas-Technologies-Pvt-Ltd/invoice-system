import React, {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
//import {Provider, useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import Sidebar from './shared/Sidebar';
import Layout from './shared/Layout';


function ProtectedsRoute({children}) {
    
   // const dispatch = useDispatch();
    //alert(dispatch)
    const navigate = useNavigate();
   // const {loading} =useSelector((state) => state.alerts);
    const {user, setUser} = useState(false);

    const validateToken = async()=> {

        try{
            // dispatch(ShowLoading())
            const response = await axios.post("/getprofileDetail", 
            {}, 
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            // dispatch(HideLoading())
            if(response.data.success){
                console.log('HeIF')
                navigate('/');
                setUser(true);
                //dispatch(SetUser(response.data));
            }else{
                console.log('HeElse')
                // dispatch(HideLoading())
                localStorage.removeItem('token');
               // message.error(response.data.message);
                navigate('/login');
            }
        }catch (error) {
            console.log('HeError')
            localStorage.removeItem('token');
           // message.error(error.message);
            // dispatch(HideLoading())
            navigate('/login');

        }
    };
    useEffect(() => {
        if(localStorage.getItem('token')){
            console.log('He')
            validateToken();
        }else{
            console.log('SHe')
            navigate('/login');
        }
    }, []);
    console.log(user)
    return <div>{user && <Layout>{children}</Layout>}</div>
    
}

export default ProtectedsRoute
