import Router from 'express'
import { authRequired } from "../middlewares/validateToken.js";
import { deleteReport, getReports, saveReport, updateReport } from '../controllers/reported_user.controller.js';
import { deleteReportPost, getReportsPost, saveReportPost, updateReportPost } from '../controllers/reported_post.controller.js';

const routerReport = Router();


routerReport.post('/save-report-user', authRequired, saveReport);
routerReport.put('/update-report-user', authRequired, updateReport);
routerReport.delete('/remove-report-user', authRequired, deleteReport);
routerReport.get('/fecth-reports-user', authRequired, getReports);

routerReport.post('/save-report-post', authRequired, saveReportPost);
routerReport.put('/update-report-post', authRequired, updateReportPost);
routerReport.delete('/remove-report-post', authRequired, deleteReportPost);
routerReport.get('/fecth-reports-post', authRequired, getReportsPost);

export default routerReport;