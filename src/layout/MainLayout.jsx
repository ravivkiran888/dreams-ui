import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
   
 <>
          <Navbar></Navbar>

            <div className="d-flex">
                
                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </>

  )
}

export default MainLayout