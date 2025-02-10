const Role = require("../models/roleModel")

class RolesService{

  // Create a new role
  async create_role(role_data) {
    const {role_name, role_description} = role_data
    if (!role_name || !role_description) {
      const error = new Error("Role name and description are required!");
      error.status = 400; throw error;
    }
    const createRole = await Role.create({role_name, role_description})
    if (!createRole){
      const error = new Error("The role couldn't be created");
      error.status = 500; throw error;
    }
    return createRole;
  }


  //Get a specific role by id
  async get_role_by_id(role_id){
    const role = await Role.findByPk(role_id)
    if (!role){
      const error = new Error("The role couldn't be found");
      error.status = 404; throw error;
    }
    return role;
  }


  // Get all roles
  async get_all_roles(){
    const all_roles = await Role.findAll()
    if (!all_roles){
      const error = new Error("The roles couldn't be found");
      error.status = 404; throw error;
    }
    return all_roles;
  }


  // Update an existing role
  async update_role(role_id, updateAttributes){
      if (Object.keys(updateAttributes).length === 0) {
        const error = new Error("No valid attributes provided for update");
        error.status = 400; throw error;
        }
      await Role.update(updateAttributes, {where: {role_id}})
      await this.role_row_updated(role_id)
      return { message: `Role data has been updated successfully.`}
  }


  //Track last updated time
  async role_row_updated(role_id){
    updated_role = await Role.findByPk(role_id)
    if (updated_role) {
        updated_role.updated_at = new Date()
        await updated_role.save()
    }
  }


  // Delete a role
  async delete_role(role_id){
    const role = await Role.findByPk(role_id)
    if (!role){
      const error = new Error("The role couldn't be found");
      error.status = 404; throw error;
    }
    const deleteRole = await role.destroy()
    if (!deleteRole){
      const error = new Error("The role couldn't be delete");
      error.status = 500; throw error;
    }
    return deleteRole
  }
}


module.exports = new RolesService()
