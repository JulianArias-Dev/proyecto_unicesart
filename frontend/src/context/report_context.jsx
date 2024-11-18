// ReportContext.js
import { createContext, useState } from "react";
import PropTypes from 'prop-types';
import { handleRequest } from './helper_api';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [errors, setErrors] = useState([]);
    const [usuariosReportados, setUsuariosReportados] = useState([]);
    const [publicacionesReportadas, setPublicacionesReportadas] = useState([]);

    // --- CRUD para Usuarios Reportados ---
    const saveUserReport = async (data) => {
        try {
            const res = await handleRequest('post', '/save-report-user', data, "Reporte de usuario guardado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const updateUserReport = async (id) => {
        try {
            const res = await handleRequest('put', '/update-report-user', { _id: id }, "Reporte de usuario actualizado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const deleteUserReport = async (id) => {
        try {
            const res = await handleRequest('delete', '/remove-report-user', { params: { _id: id } }, "Reporte de usuario eliminado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const fetchUserReports = async (filters) => {
        try {
            const res = await handleRequest('get', '/fetch-reports-user', { params: filters });
            if (res.data && res.data.reports) setUsuariosReportados(res.data.reports);
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    // --- CRUD para Publicaciones Reportadas ---
    const savePostReport = async (data) => {
        try {
            const res = await handleRequest('post', '/save-report-post', data, "Reporte de publicación guardado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const updatePostReport = async (id) => {
        try {
            const res = await handleRequest('put', '/update-report-post', { _id: id }, "Reporte de publicación actualizado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const deletePostReport = async (id) => {
        try {
            const res = await handleRequest('delete', '/remove-report-post', { params: { _id: id } }, "Reporte de publicación eliminado.");
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    const fetchPostReports = async (filters) => {
        try {
            const res = await handleRequest('get', '/fetch-reports-post', { params: filters });
            if (res.data && res.data.reports) setPublicacionesReportadas(res.data.reports);
            return res.data;
        } catch (error) {
            setErrors((prev) => [...prev, error]);
            return false;
        }
    };

    return (
        <ReportContext.Provider
            value={{
                errors,
                usuariosReportados,
                publicacionesReportadas,
                saveUserReport,
                updateUserReport,
                deleteUserReport,
                fetchUserReports,
                savePostReport,
                updatePostReport,
                deletePostReport,
                fetchPostReports,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};

ReportProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
