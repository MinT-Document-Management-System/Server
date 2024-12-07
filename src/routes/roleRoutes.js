const express = require('express');
const roleController = require('../controllers/roleController'); // Import the controller

const role_router = express.Router();

// Define role-related routes
role_router.get('/', roleController.getAllRoles);
role_router.get('/:id', roleController.getRoleById);
role_router.post('/', roleController.createRole);
role_router.put('/:id', roleController.updateRole);
role_router.delete('/:id', roleController.deleteRole);

module.exports = role_router;
