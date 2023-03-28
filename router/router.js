import { Router } from "express";
import userController from "../controllers/user-controller.js";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (a, b, cb) => {
    cb(null, "uploads");
  },
  filename: (a, file, cb) => {
    cb(null, new Date().toString() + "-" + file.originalname);
  },
});
const upload = multer({ storage }).single("image");

const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.post("/create-card", authMiddleware, userController.createCard);
router.delete("/delete-card/:id", authMiddleware, userController.deleteCard);
router.patch("/complete-card/:id", userController.completeCard);
router.get("/cards", authMiddleware, userController.getCards);
router.delete(
  "/delete-completed/:id",
  authMiddleware,
  userController.deleteCompleted
);
router.post("/delete-img", userController.deleteImg);
router.delete(
  "/delete-cards/:id",
  authMiddleware,
  userController.deleteAllCards
);
router.post("/upload", authMiddleware, upload, (req, res) => {
  res.json(req.file);
});

export default router;
