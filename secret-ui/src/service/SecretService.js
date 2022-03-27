const axios = require('axios');
const apiUrl = "https://safe-mesa-34154.herokuapp.com/"

function responseFormatter(response){
    const res = {
        status: response.status,
        data: response.data ? response.data : null
    }
    return res
}

export async function getSecret(hash) {
    try{
        const response = await axios.get(`${apiUrl}secret/${hash}`);
        return responseFormatter(response);

    }catch(error) {
        return responseFormatter(error.response);
    }   
}

export async function storeSecret(data) {

    try{
        const response = await axios.post(`${apiUrl}secret`, data);
        return responseFormatter(response);
        
    }catch(error) {
        return responseFormatter(error.response);
    }
    
}