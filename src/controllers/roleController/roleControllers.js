const RolesService = require('../../services/rolesServices');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RolesService.get_all_roles();

    res.status(200).json(roles);

  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get a specific role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RolesService.getRoleById(id);
    res.status(200).json(role);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { role_name, role_description } = req.body;
    const newRole = await RolesService.createRole({ role_name, role_description});
    res.status(201).json(newRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRole = await RolesService.deleteRole(id);
    res.status(204).json(deleteRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
