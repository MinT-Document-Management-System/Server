
const RBAC = require('./role_based_access_permission.js')

const getPathSegments = (original_url) => {
    const segments = original_url.split('/').filter(segment => segment.length > 0);
    
    const primaryRoute = segments[1] || null; // Determines the router
    const secondaryRoute = segments[2] || null;  // Used for checking access
    
    return { primaryRoute, secondaryRoute };
};

const authorize = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) 
            return res.status(401).json({ message: 'Unauthorized' })
        
        // Admin has full authority
        if (user.role_name === 'admin') next();


        const { primaryRoute, secondaryRoute } = getPathSegments(req.originalUrl); 

        switch (primaryRoute) {
            case 'user':
                
                break;
        
            case 'letter':
                
                break;
        
            case 'department':
                
                break;
        
            case 'role':
                
                break;
        
            case 'placeholder':
                
                break;
        
            default:
                break;
        }
        

        // const userPermissions = rolePermissions[user.role] || [];
        // if (!userPermissions.includes(requiredPath)) {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }

        next();
        
    } catch (error) {
        
        return res.status(403).json({ message: error.message });
    
    }
    
}

module.exports = authorize
