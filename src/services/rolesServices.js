const pool = require('../config/db'); // Import database connection

// Get all roles
exports.getAllRoles = async () => {
  const result = await pool.query('SELECT * FROM roles');
  return result.rows;
};

// Get a specific role by ID
exports.getRoleById = async (id) => {
  const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
  return result.rows[0];
};

// Create a new role
exports.createRole = async ({ role_name, role_description, created_at }) => {
  const result = await pool.query(
    'INSERT INTO roles (role_name, role_description,created_at) VALUES ($1, $2, $3) RETURNING *',
    [role_name, role_description,created_at]
  );
  return result.rows[0];
};

// Update an existing role
exports.updateRole = async (id, { roleName, permissions }) => {
  const result = await pool.query(
    'UPDATE roles SET role_name = $1, permissions = $2 WHERE id = $3 RETURNING *',
    [roleName, permissions, id]
  );
  return result.rows[0];
};

// Delete a role
exports.deleteRole = async (id) => {
  await pool.query('DELETE FROM roles WHERE id = $1', [id]);
};
