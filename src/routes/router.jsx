import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import MainLayout from "../layout/MainLayout"
import Dashboard from "../pages/Dashboard"
import OptionChain from "../pages/OptionChain"
import { dashboardLoader } from "../loaders/dashboardLoader"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>

            <Route
                index
                element={<Dashboard />}
                loader={dashboardLoader}
            />

            <Route
                path="option-chain"
                element={<OptionChain />}
            />

        </Route>
    )
);

export default router;