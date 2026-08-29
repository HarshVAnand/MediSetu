import express from "express";
import multer from "multer";

import {

  uploadPrescription,

  askMedicalQuestion

} from "../controllers/ragController.js";


const router = express.Router();


const upload =
  multer({
    dest: "uploads/"
  });


router.post(

  "/upload",

  upload.single("prescription"),

  uploadPrescription

);


router.post(

  "/ask",

  askMedicalQuestion

);


export default router;