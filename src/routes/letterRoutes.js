const express = require("express")
const { upload_letter, get_letter ,get_all_letters} = require("../controllers/letterController/letterControllers")
const upload = require("../services/file-services/multerService.js")


const router = express.Router()

// Upload Letter route
router.post("/upload_letter", upload.single('file'), upload_letter)
// Get Letter route
router.get("/get_letter/:public_id", get_letter)
// GEt all Letters
router.get("/get_all_letters", get_all_letters)

module.exports = router
