import React, { Fragment, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineChat, HiOutlineLogout, HiOutlineSearch } from 'react-icons/hi'
import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

export default function Headers() {
  const navigate = useNavigate();
   const logout = () => {
    localStorage.removeItem('token');
    navigate('login');
  };

  return (
    <div className='bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200'>
      <div className='relative'>
        <HiOutlineSearch fontSize={24} className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
          <input 
          type="text"
          placeholder='Search...'
          className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 pr-4'
          /> 
        </div>
        <div className='flex items-center gap-2 mr-2'>
        <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className={classNames(open && 'bg-gray-100','p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none')} >
              <HiOutlineChat fontSize={24} />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                   <strong className='text-gray-700 font-medium'>Message</strong>
                      <div className='mt-2 py-1 text-sm'>
                        Message Panel Looking!
                      </div>
                  </div>
                  </Popover.Panel>
              </Transition>
            </>)}
            </Popover>
            <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className={classNames(open && 'bg-gray-100','p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none')} >
              <HiOutlineBell fontSize={24} />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                   <strong className='text-gray-700 font-medium'>Notification</strong>
                      <div className='mt-2 py-1 text-sm'>
                        notification Panel Looking!
                      </div>
                  </div>
                  </Popover.Panel>
              </Transition>
            </>)}
            </Popover>
            <Menu as="div" className="relative">
              <div className='inline-flex'>
              <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
                <div 
                className='h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center' 
                style={{ backgroundImage: 'url("https://hr.zaptas.in/assets/images/zlogo.PNG")'}}>
                  <span className='sr-only'>Brijesh Sharma</span>
                </div>
              </Menu.Button>
              </div>
              <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => 
                <div className={classNames(active && 'bg-gray-100',
                'text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 py-2')}
                 onClick={() => navigate('/profile') }>Your Profile
                 </div> }
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => 
                <div className={classNames(active && 'bg-gray-100',
                'text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 py-2')}
                 onClick={() => navigation('/') }>Setting
                 </div> }
              </Menu.Item> */}
              <a ><Menu.Item>
                {({ active }) => 
                <div className={classNames(active && 'bg-gray-100',
                'text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 py-2 sm:max-w-md')}
                onClickCapture={logout}>Log Out
                 </div> }
              </Menu.Item></a>
              </Menu.Items>
              </Transition>
            </Menu>
        </div>
    </div>
  )
}
// function logoutApp(e){
//   if(e === true){
//     localStorage.removeItem("token");
//     window.location="login";
//  }else {
//     window.location="/";
//   }
// }