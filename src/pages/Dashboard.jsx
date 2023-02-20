import React from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid'
import InvoiceListing from '../components/InvoiceListing'

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