import classNames from 'classnames';
import React from 'react'
import { FcBullish } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dashboard_sidebar_bottom_Link, Dashboard_Sidebar_Link } from '../../lib/constant/navigation'

const linkClasses = 
'flex flex-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';
export default function Sidebar() {
    const navigation  =useNavigate()
    const logout = () => {
        localStorage.removeItem('token');
        navigation('/login');
      };
  return (
    <div className='bg-neutral-900 w-60 p-3 flex flex-col text-white'>
        <div className='flex items-center gap-2 px-1 py-3'>
            <FcBullish fontSize={24} />
            <span className='text-neutral-200 text-lg'>Zaptas Invoice</span>
        </div>
        <div className='flex-1 flex flex-col overflow-auto'>
            <div className='flex-1 py-8 flex flex-col gap-0.5'>
                {Dashboard_Sidebar_Link.map((item) => (
                        <SidebarLink key={item.key} item={item} />
                    ))}
            </div>
            <div className='flex flex-col pt-2 gap-0.5 border-t border-neutral-700'>
                {Dashboard_sidebar_bottom_Link.map((item) => (
                    <SidebarLink key={item.key} item={item} />
                ))}
                <a>
                <div className={classNames
                    ('text-red-500', linkClasses) } onClickCapture={logout}>
                    <span className='text-xl'><HiOutlineLogout /></span>
                    Log Out
                </div></a>
            </div>
        </div>
    </div>
  )
}

function SidebarLink({item}){
    const { pathname } = useLocation()
        return (
            <Link to={item.path} className={classNames
            (pathname === item.path ? 'bg-neutral-700 text-white':'text-neutral-400',linkClasses) }>
                <span className='text-xl'>{item.icon}</span>
                {item.label}
            </Link>
        )
}