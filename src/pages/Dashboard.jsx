import React from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid'
import InvoiceListing from '../components/InvoiceListing'
// import TransactionChart from '../components/TransactionChart'
// import RecentOrders from '../components/RecentOrders'
// import BuyerProfilePieChart from '../components/BuyerProfilePieChart'
// import PopularProducts from '../components/PopularProducts'

export default function Dashboard() {
	return (
		<div className="flex flex-col gap-4 w-full">
			<DashboardStatsGrid />
			 
				<InvoiceListing />
			
			{/* <div className="flex flex-row gap-4 w-full">
				<InvoiceListing />
			</div> */}
		</div>
	)
}