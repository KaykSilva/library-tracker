import axios from "axios";
import { Api } from "./api";

export const loginRequest = async (formData: any) => {

    try {
        const response = await Api.post(`login`, formData);
        return response.data.token;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            return statusCode
        } else {
            console.error('Erro inesperado:', error);
            throw new Error('Erro inesperado');
        }
    }
}
