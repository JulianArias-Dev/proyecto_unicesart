import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from "axios";

const ReportContext = createContext();

export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
}

export const ReportProvider = ({ children }) => {
    const API = 'http://localhost:4000/api';
    const [errors, setErrors] = useState([]);
    const [usuariosReportados, setUsuariosReportados] = useState([]);
    const [publicacionesReportadas, setPublicacionesReportadas] = useState([]);

    const UserReportCRUD = async (process, data) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Procesando la solicitud...",
                html: "Por favor, espere.",
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => { }, 200);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            let res;
            switch (process) {
                case 1:
                    res = await axios.post(`${API}/save-report-user`, data, { withCredentials: true });
                    break;
                case 2:
                    res = await axios.put(`${API}/update-report-user`, { _id: data }, { withCredentials: true });
                    break;
                case 3:
                    res = await axios.delete(`${API}/remove-report-user`, { params: { _id: data }, withCredentials: true });
                    break;
                case 4:
                    res = await axios.get(`${API}/fetch-reports-user`, { params: data, withCredentials: true });
                    break;
                default:
                    throw new Error("Proceso no definido");
            }

            if (res.status === 201 || res.status === 200) {
                if (res.data.reports) {
                    setUsuariosReportados(res.data.reports)
                }

                Swal.close();
                if (process !== 4) {
                    withReactContent(Swal).fire({
                        title: res.status === 201 ? "Operación exitosa" : "Operación completada",
                        text: "¡Operación realizada con éxito!",
                        icon: "success"
                    });
                }
                return res.data;  // Para obtener datos si es necesario
            } else {
                withReactContent(Swal).fire({
                    title: "Operacion Fallida",
                    text: res.data?.message || "¡Ha ocurrido un error inesperado!",
                    icon: "error"
                });
            }

        } catch (error) {
            Swal.close();
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al procesar la solicitud.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
            return false;
        }
    };

    const PostReportCRUD = async (process, data) => {
        let timerInterval;
        try {
            Swal.fire({
                title: "Procesando la solicitud...",
                html: "Por favor, espere.",
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => { }, 200);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            let res;
            switch (process) {
                case 1:
                    res = await axios.post(`${API}/save-report-post`, data, { withCredentials: true });
                    break;
                case 2:
                    res = await axios.put(`${API}/update-report-post`, { _id: data }, { withCredentials: true });
                    break;
                case 3:
                    res = await axios.delete(`${API}/remove-report-post`, { params: { _id: data }, withCredentials: true });
                    break;
                case 4:
                    res = await axios.get(`${API}/fetch-reports-post`, { params: data, withCredentials: true });
                    break;
                default:
                    throw new Error("Proceso no definido");
            }

            if (res.status === 201 || res.status === 200) {
                if (res.data.reports) {
                    setPublicacionesReportadas(res.data.reports);
                }
                Swal.close();
                if (process !== 4) {
                    withReactContent(Swal).fire({
                        title: res.status === 201 ? "Operación exitosa" : "Operación completada",
                        text: "¡Operación realizada con éxito!",
                        icon: "success"
                    });
                }
                return res.data;
            } else {
                withReactContent(Swal).fire({
                    title: "Operación Fallida",
                    text: res.data?.message || "¡Ha ocurrido un error inesperado!",
                    icon: "error"
                });
            }

        } catch (error) {
            Swal.close();
            withReactContent(Swal).fire({
                title: "Error",
                text: error.response?.data?.message || "Error al procesar la solicitud.",
                icon: "error"
            });

            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
            return false;
        }
    };


    return (
        <ReportContext.Provider value={{
            errors,
            usuariosReportados,
            publicacionesReportadas,
            PostReportCRUD,
            UserReportCRUD,
        }}>
            {children}
        </ReportContext.Provider>
    );
}

ReportProvider.propTypes = {
    children: PropTypes.node.isRequired,
};