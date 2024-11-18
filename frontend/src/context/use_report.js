import { useContext } from "react";
import { ReportContext } from "./report_context";

const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('El usuario debe ser usado con authProvider');
    }
    return context;
}

export default useReport;