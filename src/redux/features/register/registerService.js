import { REST_URL_REGISTER } from "../../../tools/constant";
import { sendPostRequest } from "../../../tools/helper";

export const uploadRegisterAsync = async (data) => {
    const url = REST_URL_REGISTER
    const respon = sendPostRequest(url, data)
    return respon
}
