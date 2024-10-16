import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom';

export const GetLoginUserDetails = async () => {
    try{
        const response = await axios.post("https://invoice-system-h9ds.onrender.com/v1/api/getprofileDetail", 
        {}, 
        {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        //const response = await axios.get('/getprofileDetail/'+localStorage.getItem("token"));
        if(response.data.success == true){
            const data = []
           return response.data.data[0]
        }
    }catch (error){
        return error
    }
}

