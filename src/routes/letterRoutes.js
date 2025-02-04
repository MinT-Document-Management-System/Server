const express = require("express")
const { upload_letter, get_letter, get_all_letters, delete_letter, grant_access, revoke_access} = require("../controllers/letterController/letterControllers")
const upload = require("../services/file-services/multerService.js")


const router = express.Router()

// Upload Letter route
router.post("/upload_letter", upload.single('file'), upload_letter)
// Get Letter route
router.get("/get_letter/:public_id", get_letter)
// Get all Letters
router.get("/get_all_letters", get_all_letters)
// Delete Letter route
router.delete('/delete_letter/:public_id', delete_letter)
// Grant access to Letter
router.patch('/grant_access', grant_access)
// Revoke access to Letter
router.patch('/revoke_access', revoke_access)

module.exports = router
