const express = require('express');
const roleController = require('../controllers/roleController'); // Import the controller

const router = express.Router();

// Define role-related routes
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
