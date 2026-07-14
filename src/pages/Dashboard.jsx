import React from 'react'
import { useLoaderData } from 'react-router-dom'
import MarketIndices from '../components/MarketIndices'

const Dashboard = () => {
  const loaderData = useLoaderData()

  return (
    <div>
      {/* Market Indices Component */}
      <MarketIndices 
        data={loaderData.marketIndices.data} 
        error={loaderData.marketIndices.error} 
      />

      {/* Add other components here */}
      {/* <NewsComponent 
        data={loaderData.news.data} 
        error={loaderData.news.error} 
      />
      <ChartsComponent 
        data={loaderData.charts.data} 
        error={loaderData.charts.error} 
      /> */}
    </div>
  )
}

export default Dashboard