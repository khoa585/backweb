const express = require('express')
const router = express.Router()
import getListInLink from './getList'
router.use("/", getListInLink);
export default router;
