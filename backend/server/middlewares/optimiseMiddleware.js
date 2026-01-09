const OptimiseController = require('../controller/OptimiseController');

// Middleware to check if app is active before processing requests
exports.checkAppStatus = (req, res, next) => {
    // Allow access to optimise endpoint even when app is down (both API and frontend routes)
    // Check both path and originalUrl to catch all optimise routes
    const path = req.path || '';
    const originalUrl = req.originalUrl || '';
    const fullPath = path + originalUrl;
    
    // Allow all optimise-related routes (API and frontend)
    if (path.includes('/optimise') || 
        originalUrl.includes('/optimise') || 
        fullPath.includes('/optimise') ||
        path.includes('/api/optimise') ||
        originalUrl.includes('/api/optimise')) {
        return next();
    }
    
    // Check if app is active
    if (!OptimiseController.isAppActive()) {
        const state = OptimiseController.getAppState();
        return res.status(503).json({
            success: false,
            message: state.message || 'Application is currently down for maintenance',
            data: {
                isActive: false
            }
        });
    }
    
    next();
};
