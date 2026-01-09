const OptimiseController = require('../controller/OptimiseController');

// Middleware to check if app is active before processing requests
exports.checkAppStatus = (req, res, next) => {
    // Allow access to optimise endpoint even when app is down
    if (req.path.includes('/optimise') || req.path.includes('/api/optimise')) {
        return next();
    }
    
    // Check if app is active
    if (!OptimiseController.isAppActive()) {
        const state = OptimiseController.getAppState();
        return res.status(503).json({
            success: false,
            message: state.message || 'Application is currently down for maintenance',
            data: {
                isActive: false,
                lastUpdated: state.lastUpdated
            }
        });
    }
    
    next();
};
