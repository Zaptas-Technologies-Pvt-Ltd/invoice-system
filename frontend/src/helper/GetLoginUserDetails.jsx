import axios from 'axios';

export const GetLoginUserDetails = async () => {
    try{
        const response = await axios.post("https://invoice-system-h9ds.onrender.com/api/getprofileDetail", 
        {}, 
        {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        //const response = await axios.get('/getprofileDetail/'+localStorage.getItem("token"));
        if(response.data.success === true){
           return response.data.data[0]
        }
    }catch (error){
        return error
    }
}

