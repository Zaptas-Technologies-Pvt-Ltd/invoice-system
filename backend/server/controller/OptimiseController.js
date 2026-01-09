const fs = require('fs');
const path = require('path');

// Path to store app state
const TMP_DIR = path.join(__dirname, '../../tmp');
const STATE_FILE = path.join(TMP_DIR, 'app-state.json');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Default state
const DEFAULT_STATE = {
    isActive: true,
    lastUpdated: new Date().toISOString(),
    message: 'Application is running'
};

// Read current state
const getAppState = () => {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_STATE;
    } catch (error) {
        console.error('Error reading app state:', error);
        return DEFAULT_STATE;
    }
};

// Write state to file
const setAppState = (state) => {
    try {
        const stateData = {
            ...state,
            lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(STATE_FILE, JSON.stringify(stateData, null, 2));
        return stateData;
    } catch (error) {
        console.error('Error writing app state:', error);
        throw error;
    }
};

// Get current app status
exports.getStatus = (req, res) => {
    try {
        const state = getAppState();
        res.status(200).json({
            success: true,
            data: state,
            message: state.isActive ? 'Application is active' : 'Application is down'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching app status',
            error: error.message
        });
    }
};

// Toggle app state (start/stop)
exports.toggleState = (req, res) => {
    try {
        const currentState = getAppState();
        const newState = {
            isActive: !currentState.isActive,
            message: !currentState.isActive 
                ? 'Application is running' 
                : 'Application is currently down for maintenance',
            lastUpdated: new Date().toISOString()
        };
        
        const updatedState = setAppState(newState);
        
        res.status(200).json({
            success: true,
            data: updatedState,
            message: updatedState.isActive 
                ? 'Application has been started successfully' 
                : 'Application has been stopped successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling app state',
            error: error.message
        });
    }
};

// Set specific state
exports.setState = (req, res) => {
    try {
        const { isActive, message } = req.body;
        
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isActive must be a boolean value'
            });
        }
        
        const newState = {
            isActive,
            message: message || (isActive 
                ? 'Application is running' 
                : 'Application is currently down for maintenance'),
            lastUpdated: new Date().toISOString()
        };
        
        const updatedState = setAppState(newState);
        
        res.status(200).json({
            success: true,
            data: updatedState,
            message: updatedState.isActive 
                ? 'Application has been started successfully' 
                : 'Application has been stopped successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error setting app state',
            error: error.message
        });
    }
};

// Export function to check if app is active (for middleware)
exports.isAppActive = () => {
    const state = getAppState();
    return state.isActive;
};

// Export function to get state (for middleware)
exports.getAppState = getAppState;
