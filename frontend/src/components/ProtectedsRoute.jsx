import React, {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
//import DefaultLayout from './DefaultLayout';
import Layout from './shared/Layout';


function ProtectedsRoute({children}) {
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const {loading} =useSelector((state) => state.alerts);
    const {user} = useSelector(state => state.users);
    const validateToken = async()=> {
        try{
            dispatch(ShowLoading())
            const response = await axios.post(
            "https://invoice-system-h9ds.onrender.com/api/getprofileDetail", 
            {}, 
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            dispatch(HideLoading())
            if(response.data.success){
                dispatch(SetUser(response.data.data[0]));
            }else{
                dispatch(HideLoading())
                localStorage.removeItem('token');
                alert.error(response.data.message);
                navigate('/login');
            }
        }catch (error) {
            localStorage.removeItem('token');
            alert.error('Remove token');
            dispatch(HideLoading())
            navigate('/login');

        }
    };
    useEffect(() => {
        if(localStorage.getItem('token')){
            validateToken();
        }else{
            navigate('/login');
        }
    }, []);

    return <div>{user && <Layout>{children}</Layout>}</div>
    
}

export default ProtectedsRoute
