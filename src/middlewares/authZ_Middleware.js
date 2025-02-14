
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
                if (secondaryRoute in RBAC.user.general) break
                if (user.role_name in ['it', 'admin']) break
                return res.status(401).json({ message: 'Unauthorized' })
        
            case 'letter':
                if (user.role_name in ['record_official', 'admin']) break
                if (user.role_name === 'it') { return res.status(401).json({ message: 'IT officiers are unauthorized to access letter endpoints.' }) }
                if (secondaryRoute in RBAC.letter.general) break
                if (user.role_name === 'department_head' && secondaryRoute in RBAC.letter.department_head) break 
                return res.status(401).json({ message: 'Unauthorized' })
        
            case 'department':
                if (secondaryRoute in RBAC.department.general) break
                if (user.role_name in ['staff', 'record_official', 'department_head']) return res.status(401).json({ message: 'Unauthorized' })
                break;
        
            case 'role':
                if (user.role_name in ['it', 'admin']) break
                if (secondaryRoute in RBAC.role.general) break
                return res.status(401).json({ message: 'Unauthorized' })
        
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
