import { REST_URL_LOGIN } from "../../../tools/constant";
import { sendPostRequest } from "../../../tools/helper";

export const uploadLogin = async (data) => {
    console.log(data);
    const url = REST_URL_LOGIN
    const respon = sendPostRequest(url, data)
    return respon
}

