import axios from "axios"

axios.defaults.withCredentials=true;
export const axiosInstance=axios.create({
    baseURL:"http://localhost:5000"
});

export const apiConnector=(method,url,bodyData,headers,params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData ? bodyData:null,
        headers: headers ? headers: null,
        params:params? params: null
    })
}