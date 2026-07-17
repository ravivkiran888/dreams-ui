import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
} from "react-router-dom";
import { Suspense } from "react";

import MainLayout from "../layout/MainLayout"
import Dashboard from "../pages/Dashboard"
import HighVolumeScripts from "../pages/highvolume"
import BullishSignals from "../pages/bullish"
import Loader from "../components/Loader"
import { dashboardLoader } from "../loaders/dashboardLoader"
import { highVolumeScriptsLoader } from "../loaders/highVolumeScriptsLoader"
import { bullishLoader } from "../loaders/bullishLoader"
import { mainLayoutLoader } from "../loaders/mainLayoutLoader"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />} loader={mainLayoutLoader}>

            <Route
                index
                element={
                    <Suspense fallback={<Loader message="Loading dashboard..." />}>
                        <Dashboard />
                    </Suspense>
                }
                loader={dashboardLoader}
            />

            <Route
                path="high-volume-scripts"
                element={
                    <Suspense fallback={<Loader message="Loading high volume scripts..." />}>
                        <HighVolumeScripts />
                    </Suspense>
                }
                loader={highVolumeScriptsLoader}
            />

            <Route
                path="bullish"
                element={
                    <Suspense fallback={<Loader message="Loading bullish signals..." />}>
                        <BullishSignals />
                    </Suspense>
                }
                loader={bullishLoader}
            />

            <Route
                path="home"
                element={<Navigate to="/" replace />}
            />

        </Route>
    )
);

export default router;


