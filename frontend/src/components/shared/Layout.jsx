import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Headers from './Headers';
import Sidebar from './Sidebar';

export default function Layout({children}) {
  const navigate = useNavigate();
 // render() {
    if (localStorage.getItem('token') == '' || localStorage.getItem('token') == null) {
     navigate('/login')
    }
  return (
    <div className='bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row'>
        <Sidebar />
        <div className='flex flex-col flex-1'>
                <Headers />
            <div className='flex-1 p-4 min-h-0 overflow-auto'>{ <Outlet /> }</div>
        </div>
    </div>
  );
//}
}
