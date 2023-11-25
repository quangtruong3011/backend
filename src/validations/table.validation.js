import * as Yup from "yup";

export const tableSchema = Yup.object().shape({
    tableName: Yup.string().required("Table Name is required"),
    maxPersons: Yup.number().required("Max persons is required"),
});