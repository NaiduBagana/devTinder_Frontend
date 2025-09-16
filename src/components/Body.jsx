import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch,useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';


const Body = () => {
    const dispath = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store)=>store.user.user);
    const getUser = async () => {
        if(user) return;
        try{
            const response = await axios.get(BASE_URL+"/profile/view", {withCredentials:true});
            const user  = response?.data;
            dispath(addUser(user));
            if(user)
            navigate("/");

        }
        catch(err){
            if(err.response && err.response.status === 401)
            navigate("/login");
            console.log(err);
        }
    }
    useEffect(()=>{
        getUser();
    },[])
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default Body;
