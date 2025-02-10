const RolesService = require('../../services/rolesServices');


const createRole = async (req, res) => {
  try {
    const role_data = req.body;
    const newRole = await RolesService.create_role(role_data);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const role = await RolesService.get_role_by_id(role_id);
    res.status(200).json(role);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await RolesService.get_all_roles();

    res.status(200).json(roles);

  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const role_data = req.body;
    const {role_id, ...updateAttributes} = role_data
    const updatedRole = await RolesService.update_role( role_id, updateAttributes );
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const deleteRole = await RolesService.delete_role(role_id);
    res.status(204).json(deleteRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
module.exports =  { getAllRoles, getRoleById, createRole, updateRole, deleteRole }