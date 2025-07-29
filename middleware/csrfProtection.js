import csrf from 'csurf';

// Configure CSRF protection middleware
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
    },
    // Ignore CSRF for GET, HEAD, OPTIONS requests (they should be safe)
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// Conditional CSRF protection - skip for certain endpoints
const conditionalCsrfProtection = (req, res, next) => {
    // Skip CSRF protection for the token endpoint and other safe endpoints
    const skipRoutes = [
        '/api/csrf-token',
        '/api/csrf/token',
        '/api/health',
        '/' // Root route
    ];
    
    if (skipRoutes.includes(req.path) || req.method === 'GET') {
        return next();
    }
    
    return csrfProtection(req, res, next);
};

// Middleware to provide CSRF token to client
const provideCsrfToken = (req, res, next) => {
    try {
        res.locals.csrfToken = req.csrfToken();
    } catch (error) {
        // If csrfToken() fails, it might be because CSRF middleware wasn't applied
        // This is okay for routes that skip CSRF protection
    }
    next();
};

// Error handler for CSRF token validation failures
const handleCsrfError = (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            success: false,
            message: 'Invalid CSRF token. Please refresh the page and try again.',
            error: 'CSRF_TOKEN_INVALID'
        });
    }
    next(err);
};

export { conditionalCsrfProtection as csrfProtection, handleCsrfError, provideCsrfToken };

