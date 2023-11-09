import employeeModel from "../models/employee.model.js";

const generateRandomCode = async () => {
    let employeeCode;
    while (true) {
        employeeCode = generateCode();
        const employee = await employeeModel.findOne({
            employeeCode
        });

        if (!employee) {
            break;
        }
    }
    return employeeCode;
}

const generateCode = () => {
    let code = "";
    for (let i = 0; i < 9; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

export default generateRandomCode;