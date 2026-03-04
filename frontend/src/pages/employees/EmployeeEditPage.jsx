import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import EmployeeForm from "../../components/employee/EmployeeForm.jsx";
import {fetchEmployee, updateEmployee} from "../../api/employees.js";

const EmployeeEditPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const loadEmployee = async () => {
            const data = await fetchEmployee(id);
            setInitialData(data);
        };
        loadEmployee();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateEmployee(id, data);
        navigate("/employees");
    };

    return initialData ? <EmployeeForm initialData={initialData} onSubmit={handleSubmit}/> : null;
};

export default EmployeeEditPage;