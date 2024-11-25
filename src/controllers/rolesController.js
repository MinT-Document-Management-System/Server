const roleService = require('./roleService');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles.' });
  }
};

// Get a specific role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    if (!role) return res.status(404).json({ error: 'Role not found.' });
    res.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role.' });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    const newRole = await roleService.createRole({ roleName, permissions });
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role.' });
  }
};

// Update an existing role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, permissions } = req.body;
    const updatedRole = await roleService.updateRole(id, { roleName, permissions });
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role.' });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role.' });
  }
};
