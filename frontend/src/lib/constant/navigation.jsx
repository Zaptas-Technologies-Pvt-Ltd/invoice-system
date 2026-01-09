import {
    HiOutlineCalculator,
    HiOutlineCog,
    HiOutlineHome,
    HiOutlineQuestionMarkCircle,
    HiOutlineReceiptTax,
    HiOutlineServer,
    HiOutlineViewList,
    HiPlusCircle,
    HiUserGroup,
    HiOutlineDocumentText,
    HiOutlineClipboardCheck,
    HiOutlineClipboardList,
    HiOutlineDocumentAdd,
    HiOutlineDocumentReport,
    HiOutlineDocumentDuplicate,   // New: for Quotation
    HiOutlinePencilAlt,           // New: for Create Note
} from 'react-icons/hi'

export const Dashboard_Sidebar_Link = [
    {
        key: 'dashboard',
        label: 'Dashboard',
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
        label: 'Services',
        path: '/services',
        icon: <HiOutlineServer />
    },
    {
        key: 'reports',
        label: 'Tax Reports',
        path: '/reports',
        icon: <HiOutlineDocumentReport />
    },
    {
        key: 'pocreates',
        label: 'PO Create',
        path: '/pocreates',
        icon: <HiOutlineDocumentAdd />
    },
    {
        key: 'generates',
        label: 'Invoice PO Create',
        path: '/generates',
        icon: <HiOutlineClipboardCheck />
    },
    {
        key: 'withoutpogenerates',
        label: 'Invoice Create',
        path: '/withoutpogenerates',
        icon: <HiOutlineClipboardList />
    },
    {
        key: 'invoices',
        label: 'Invoice List',
        path: '/invoices',
        icon: <HiOutlineDocumentText />
    },
    {
        key: 'pi',
        label: 'PI Create',
        path: '/piperformerinvoice',
        icon: <HiOutlineCalculator />
    },
    {
        key: 'quotation',
        label: 'Quotation',
        path: '/quotation',
        icon: <HiOutlineDocumentDuplicate />
    },
    {
        key: 'createnote',
        label: 'Credit Note',
        path: '/Create-Note',
        icon: <HiOutlinePencilAlt />
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