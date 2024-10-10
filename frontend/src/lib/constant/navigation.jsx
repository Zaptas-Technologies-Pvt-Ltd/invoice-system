import {HiDocumentDuplicate, HiOutlineCalculator, HiOutlineCog, 
    HiOutlineDocumentReport, 
    HiOutlineFilm, 
    HiOutlineHome, 
    HiOutlineQuestionMarkCircle,
    HiOutlineReceiptTax,
    HiOutlineServer,
    HiOutlineUserGroup,
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
        label: 'Invoice Create',
        path: '/generates',
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
    
