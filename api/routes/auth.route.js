import express from 'express'
import { SignUp,SignIn,Google,Signout} from '../controllers/auth.controller.js'
const router=express.Router()

router.post("/signup",SignUp)
router.post("/signin",SignIn)
router.post("/google",Google)
router.get("/signout",Signout)
export default router