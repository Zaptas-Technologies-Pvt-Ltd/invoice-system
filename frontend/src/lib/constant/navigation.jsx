import {HiOutlineCalculator, HiOutlineCog, 
    HiOutlineHome, 
    HiOutlineQuestionMarkCircle,
    HiOutlineReceiptTax,
    HiOutlineServer,
    HiOutlineViewList,
    HiPlusCircle,
    HiUserGroup


} from 'react-icons/hi'

export const Dashboard_Sidebar_Link = [
    {
        key: 'dashbaord',
        label: 'Dashbaord',
        path: '/',
        icon: <HiOutlineHome />
    },
    {
        key: 'customers',
        label: 'Customers',
        path: '/customers',
        icon: <HiUserGroup />
    },
    {
        key: 'services',
        label: 'Service',
        path: '/services',
        icon: <HiOutlineServer />
    },
    {
        key: 'reports',
        label: 'Tax Reports',
        path: '/reports',
        icon: <HiOutlineReceiptTax />
    },
    {
        key: 'pocreates',
        label: 'PO Create',
        path: '/pocreates',
        icon: <HiPlusCircle />
    },
    {
        key: 'generates',
        label: 'Invoice PO Create',
        path: '/generates',
        icon: <HiOutlineCalculator />
    },
    {
        key: 'withoutpogenerates',
        label: 'Invoice Create',
        path: '/withoutpogenerates',
        icon: <HiOutlineCalculator />
    },
    {
        key: 'invoices',
        label: 'Invoice List',
        path: '/invoices',
        icon: <HiOutlineViewList />
    },
]
export const Dashboard_sidebar_bottom_Link = [
    {
        key: 'setting',
        label: 'Settings',
        path: '#',
        icon: <HiOutlineCog />
    },
    {
        key: 'support',
        label: 'Help & Support',
        path: '#',
        icon: <HiOutlineQuestionMarkCircle />
    },
]
    
