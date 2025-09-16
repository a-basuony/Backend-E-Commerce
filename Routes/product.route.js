import { getAllProducts } from "../Controller/product.controller";

const express = require("express");

const router = express.Router();

router.get("/", getAllProducts);

export default router;
