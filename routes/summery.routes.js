import express from 'express'
import { getMonthlySummary } from '../controllers/summary.controller.js'

const summaryRoutes = express.Router()

summaryRoutes.get("/:year/:month", getMonthlySummary)

export default summaryRoutes;