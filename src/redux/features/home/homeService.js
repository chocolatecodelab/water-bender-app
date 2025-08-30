import { 
REST_URL_GET_WATER_BENDER,
REST_URL_GET_AVG_SENSELOG_WATER_BENDER,
REST_URL_GET_DAILY_SENSELOG_WATER_BENDER, 
REST_URL_GET_LAST_SENSELOG_WATER_BENDER, 
REST_URL_GET_MONTHLY_SENSELOG_WATER_BENDER,
REST_URL_GET_FORECAST_WATER_BENDER
} from "../../../tools/constant";
import { 
sendGetRequest, 
sendPostRequest 
} from "../../../tools/helper";

export const downloadingWaterBenderAvg = async (params) => {
    const url = REST_URL_GET_AVG_SENSELOG_WATER_BENDER
      .replace(/\{startDate\}/, params.startDate)
      .replace(/\{endDate\}/, params.endDate);
    const respon = await sendGetRequest(url)
    return respon
  }


export const downloadingWaterBenderLast = async () => {
    const url = REST_URL_GET_LAST_SENSELOG_WATER_BENDER;
    const respon = await sendGetRequest(url);
    return respon.Data
}

export const downloadingWaterBenderMonthly = async (year) => {
  const url = REST_URL_GET_MONTHLY_SENSELOG_WATER_BENDER
  .replace(/\{year\}/, year);
  const respon = await sendGetRequest(url);
  return respon.Data
}

export const downloadingWaterBenderDaily = async () => {
  const url = REST_URL_GET_DAILY_SENSELOG_WATER_BENDER;
  const respon = await sendGetRequest(url);
  return respon.Data
}

export const downloadingWaterBenderForecast = async (hours = 12) => {
  const url = REST_URL_GET_FORECAST_WATER_BENDER;
  const respon = await sendGetRequest(url);
  return respon.Data;
}