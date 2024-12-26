const express = require('express');
const roleController = require('../controllers/roleController/roleControllers'); // Import the controller

const router = express.Router();

// Fetch All Roles Route
router.get('/getAllRoles', roleController.getAllRoles);
// Fetch a Role role_id Route
router.get('/getRole/:role_id', roleController.getRoleById);
// Create a Role Route
router.post('/createRole', roleController.createRole);
// Update a Role Route
router.put('/updateRole/:role_id', roleController.updateRole);
// Delete a Role Route
router.delete('/deleteRole/:role_id', roleController.deleteRole);

module.exports = role_router;
