const express = require('express');
const roleController = require('../controllers/roleController/roleControllers'); // Import the controller

const router = express.Router();

// Create a Role Route
router.post('/create_role', roleController.createRole);
// Fetch a Role by role_id Route
router.get('/get_role_by_id/:role_id', roleController.getRoleById);
// Fetch All Roles Route
router.get('/get_all_roles', roleController.getAllRoles);
// Update a Role Route
router.put('/update_role', roleController.updateRole);
// Delete a Role Route
router.delete('/delete_role/:role_id', roleController.deleteRole);

module.exports = router;
