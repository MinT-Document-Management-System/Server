const RolesService = require('../../services/rolesServices');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RolesService.get_all_roles();
    if (roles.success)
      res.status(200).json(roles);
    else {
      res.status(500).json(roles)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles.' });
  }
};

// Get a specific role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RolesService.getRoleById(id);
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
    const { role_name, role_description } = req.body;
    const created_at = new Date().toISOString();
    const newRole = await RolesService.createRole({ role_name, role_description ,created_at});
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
    const updatedRole = await RolesService.updateRole(id, { roleName, permissions });
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
    await RolesService.deleteRole(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role.' });
  }
};
// module.exports = roleController;
