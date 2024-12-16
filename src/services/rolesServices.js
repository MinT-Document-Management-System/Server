const Role = require("../models/roleModel")

class RolesService{
  
  // Create a new role
  async create_role(role_data) {
    const {role_name, role_description} = role_data
    if (!role_name || !role_description) {
      return {"success":false, error: "Role name and description are required!"}
    }
    try {
      await Role.create({role_name, role_description})
      return {"success":true, message: "Role has been added successfully"}
    } catch (error) {
      return {"success":false, error}
    }
  }


  //Get a specific role by id
  async get_role(role_id){
    try {
        const role = await Role.findByPk(role_id)
        return {"success": true, role}
    } catch (error) {
        return {"success": false, error}
    } 
  }  


  // Get all roles
  async get_all_roles(){
    try {
        const all_roles = await Role.findAll()
        return {"success": true, all_roles}
    } catch (error) {
        return {"success": false, error}
    }
  } 


  // Update an existing role
  async update_role(update_data){
      //Removing role_identifier id from update_data
      const {role_id, ...updateAttributes} = update_data
      if (Object.keys(updateAttributes).length === 0) {
          return {"success": false, "error":'No valid attributes provided for update'}
        }

      try {
          await role.update(updateAttributes, {where: {role_id}})
          await this.role_row_updated(role_id)
          return { "success": true, message: 'Role data updated successfully' };
      } catch (error) {
          return {"success": false, error}
      }
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
    try {
        const role = await Role.findByPk(role_id)
        await role.destroy()
        return {"success": true, message:"Role has been deleted successully."}
    } catch (error) {

    }
  }
}


module.exports = new RolesService()