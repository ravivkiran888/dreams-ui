import React from 'react'
import Navbar from '../components/Navbar'
import MarketIndices from '../components/MarketIndices'
import { Outlet, useLoaderData } from "react-router-dom";

const MainLayout = () => {
  const loaderData = useLoaderData()

  return (
   
 <>
          <Navbar></Navbar>

          {/* Market Indices - Shown on every page */}
          {loaderData?.marketIndices && (
            <div className="px-4 pt-2">
              <MarketIndices 
                data={loaderData.marketIndices.data} 
                error={loaderData.marketIndices.error} 
              />
            </div>
          )}

            <div className="d-flex">
                
                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </>

  )
}

export default MainLayout