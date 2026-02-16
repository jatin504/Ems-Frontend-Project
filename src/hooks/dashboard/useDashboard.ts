import { useState, useEffect, useCallback } from "react";
import SaveDashboardAPI from "../../api/Dashboard/SaveDahsboardAPI";
import { Toast } from "@chakra-ui/react";
import GetDashboardAPI from "../../api/Dashboard/GetDashboardAPI";
import type { CustomDashboard } from "../../types/dashboard/customDashboard";

export const useDashboard = () => {
    const [data, setData] = useState<any | null>(null);
    const [dashboards, setDashboards] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    // Create new empty / Update dashboard
    const createDashboard = async (id: string, title: string) => {
        const newDashboard = {
        id,
        title,
        config: { widgets: {} },
        };
        
        try {
            const result = await SaveDashboardAPI(newDashboard);
            if(result){
                // Persist full dashboard to localStorage and update hook state immediately
                try {
                    const stored = localStorage.getItem('dashboards');
                    const parsed = stored ? JSON.parse(stored) : [];
                    // Prefer API returned dashboard with config; fallback to newDashboard
                    const savedDashboard = result && result.config ? result : newDashboard;
                    const updated = Array.isArray(parsed) ? [...parsed, savedDashboard] : [savedDashboard];
                    localStorage.setItem('dashboards', JSON.stringify(updated));
                    setDashboards(updated);
                    setData(savedDashboard);
                } catch (e) {
                    console.warn('Failed to update local dashboards after create', e);
                }

                Toast({
                    title: 'Dashboard created.',
                    description: "We've created your dashboard for you.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
            
        } catch (error) {
            Toast({
                title: 'Error!',
                description: "somthing went wrong",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        
    };

    const saveDashboard = async (dashboard : CustomDashboard) => {
        
        try {
            const result = await SaveDashboardAPI(dashboard);
            if(result){
                // Update localStorage and hook state immediately so UI reflects changes
                try {
                    const stored = localStorage.getItem('dashboards');
                    const parsed = stored ? JSON.parse(stored) : [];
                    const savedDashboard = result && result.config ? result : dashboard;

                    let updated: any[] = [];
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        let replaced = false;
                        updated = parsed.map((d: any) => {
                            if (d.id === savedDashboard.id) {
                                replaced = true;
                                return savedDashboard;
                            }
                            return d;
                        });
                        if (!replaced) updated.push(savedDashboard);
                    } else {
                        updated = [savedDashboard];
                    }

                    localStorage.setItem('dashboards', JSON.stringify(updated));
                    setDashboards(updated);
                    setData(savedDashboard);
                    await getDashboard();
                } catch (e) {
                    console.warn('Failed to update local dashboards after save', e);
                }

                Toast({
                    title: 'Dashboard Saved.',
                    description: "We've save your dashboard for you.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
            
        } catch (error) {
            Toast({
                title: 'Error!',
                description: "somthing went wrong",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        
    };

    const getDashboard = async () => {   
        try {
            const result = await GetDashboardAPI();
            setDashboards(result.result);

            localStorage.setItem('dashboards', JSON.stringify(result.result))
        } catch (error) {
            setDashboards([]);
        }
    };


    const loadSpecifiedDashboard = (dashboardId : string) : CustomDashboard | null => {
        try {
            const dashboards = localStorage.getItem("dashboards");
            if (dashboards) {

                const parsedDashboard = JSON.parse(dashboards) as [];
                console.log("ALL HOOK: ", parsedDashboard)
                const requestDashboard = parsedDashboard.filter((d : any) => d.id == dashboardId)[0];
                console.log("Hooks: ", requestDashboard)
                // Set hook state so consumers get the loaded dashboard immediately
                if (requestDashboard) {
                    setData(requestDashboard);
                    return requestDashboard;
                }
                return null;
            } else {
                return null
            }
            //  else {

                

            //     localStorage.setItem('dashboards', JSON.stringify(dashboards))
            //     setData(dashboards[dashboardId])
            // }
        } catch (err) {
            setError("Something Went Wrong");
            return null
        } finally {
            setLoading(false);
        }
    };

    return { loadSpecifiedDashboard, createDashboard, saveDashboard, getDashboard, dashboards, data, loading, error };
};

