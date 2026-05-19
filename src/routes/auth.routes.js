import {
  register,
  login,
  getMe,
  updateProfile,
  getAddresses,
  createNewAddress,
  updateAddressById,
  deleteAddressById,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);

// Address CRUD Routes
router.get("/addresses", auth, getAddresses);
router.post("/addresses", auth, createNewAddress);
router.put("/addresses/:id", auth, updateAddressById);
router.delete("/addresses/:id", auth, deleteAddressById);

export default router;
