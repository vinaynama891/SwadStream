const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware');


const upload = multer({
    storage:multer.memoryStorage(),
})

// user auth
router.post('/user/register',authController.registerUser);
router.post('/user/login',authController.loginUser);
router.get('/user/logout',authController.logoutUser)
router.get('/user/me', authMiddleware.authUserMiddleware, authController.getUserMe)

router.get('/food-partner/list', authController.getFoodPartnersList);
router.get('/food-partner/:id', authController.getFoodPartnerById)
router.get('/food-partner/me', authMiddleware.authFoodPartnerMiddleware, authController.getFoodPartnerMe);

// food partner auth - add upload.single('profilePhoto') middleware
router.post('/food-partner/register', upload.single('profilePhoto'), authController.registerFoodPartner);
router.post('/food-partner/login',authController.loginFoodPartner);
router.get('/food-partner/logout',authController.logoutFoodPartner);

module.exports = router;