import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import MarketIndices from '../components/MarketIndices'
import { Outlet, useLocation } from "react-router-dom";
import { fetchMarketIndices } from '../store/slices/marketIndicesSlice'

const MainLayout = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { data, error, status } = useSelector((state) => state.marketIndices)

  useEffect(() => {
    dispatch(fetchMarketIndices())
  }, [dispatch, location.pathname])

  return (
   
 <>
          <Navbar></Navbar>

          {/* Market Indices - Shown on every page */}
          {(status === 'loading' || data.length > 0 || error) && (
            <div className="px-4 pt-2">
              <MarketIndices 
                data={data} 
                error={error} 
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