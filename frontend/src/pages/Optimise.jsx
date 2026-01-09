import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Services from '../service/Services';

export default function Optimise() {
    const [loading, setLoading] = useState(false);
    const [appStatus, setAppStatus] = useState(null);
    const [isActive, setIsActive] = useState(true);

    // Fetch current app status
    const fetchStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/v1/api/optimise/status');
            if (response.data.success) {
                setAppStatus(response.data.data);
                setIsActive(response.data.data.isActive);
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            toast.error('Failed to fetch app status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    // Toggle app state
    const handleToggle = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/v1/api/optimise/toggle');
            if (response.data.success) {
                setAppStatus(response.data.data);
                setIsActive(response.data.data.isActive);
                toast.success(response.data.message);
            } else {
                toast.error('Failed to toggle app state');
            }
        } catch (error) {
            console.error('Error toggling state:', error);
            toast.error('Failed to toggle app state');
        } finally {
            setLoading(false);
        }
    };

    // Set specific state
    const handleSetState = async (newState) => {
        try {
            setLoading(true);
            const response = await axios.post('/v1/api/optimise/set', {
                isActive: newState,
                message: newState 
                    ? 'Application is running' 
                    : 'Application is currently down for maintenance'
            });
            if (response.data.success) {
                setAppStatus(response.data.data);
                setIsActive(response.data.data.isActive);
                toast.success(response.data.message);
            } else {
                toast.error('Failed to set app state');
            }
        } catch (error) {
            console.error('Error setting state:', error);
            toast.error('Failed to set app state');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">App Optimise Control</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Status</h2>
                    
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    ) : appStatus ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Status:</span>
                                <span className={`px-4 py-2 rounded-full font-semibold ${
                                    appStatus.isActive 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {appStatus.isActive ? 'Active' : 'Down'}
                                </span>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 font-medium mb-2">Message:</p>
                                <p className="text-gray-600">{appStatus.message}</p>
                            </div>
                            
                            {appStatus.lastUpdated && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 font-medium mb-2">Last Updated:</p>
                                    <p className="text-gray-600">
                                        {new Date(appStatus.lastUpdated).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-600">No status available</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Actions</h2>
                    
                    <div className="space-y-4">
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : isActive 
                                        ? 'bg-red-600 hover:bg-red-700' 
                                        : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? 'Processing...' : isActive ? 'Stop Application' : 'Start Application'}
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSetState(true)}
                                disabled={loading || isActive}
                                className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                                    loading || isActive
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                Start App
                            </button>
                            
                            <button
                                onClick={() => handleSetState(false)}
                                disabled={loading || !isActive}
                                className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                                    loading || !isActive
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                Stop App
                            </button>
                        </div>

                        <button
                            onClick={fetchStatus}
                            disabled={loading}
                            className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> Stopping the application will prevent all API requests from being processed. 
                        Only the /optimise endpoint will remain accessible to restart the application.
                    </p>
                </div>
            </div>
        </div>
    );
}
