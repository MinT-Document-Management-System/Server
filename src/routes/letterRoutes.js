const express = require("express")
const { upload_letter, get_letter } = require("../controllers/letterController/letterControllers")
const upload = require("../services/file-services/multerService.js")


const router = express.Router()

// Upload Letter route
router.post("/upload_letter", upload.single('file'), upload_letter)
// Get Letter route
router.get("/get_letter/:public_id", get_letter)

module.exports = router