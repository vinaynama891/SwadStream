const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage:multer.memoryStorage(),
})


router.post('/reel/upload', authMiddleware.authFoodPartnerMiddleware,upload.single("video") ,foodController.createFood)

router.get('/partner/:partnerId', foodController.getFoodItemsByPartner)

router.get('/',
    foodController.getFoodItems
)

module.exports = router;