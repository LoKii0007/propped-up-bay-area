import axios from "axios"

// const baseUrl = 'http://localhost:5000/api/orders'
const baseUrl = 'https://propped-up-bay-area-1.onrender.com/api/orders'
// const authToken = localStorage.getItem('authToken')


//? CREATE openhouse order api
export const openhouseOrder = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/openHouseOrder`, data, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
        return ({res : {status : 500 }})
    }
}

//? GET openhouse order api
export const getOpenHouseOrder = async () => {
    try {
        const response = await axios.get(`${baseUrl}/openHouseOrder`, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching get-openHouseOrders api', error.message)
        return ({res : {status : 500 }})
    }
}

//? CREATE post order api
export const postOrder = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/postOrder`, data, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching postorder orders api', error)
    }
}


//? GET post order api
export const getpostOrder = async () => {
    try {
        const response = await axios.get(`${baseUrl}/postOrder`, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching get-postOrders api', error.message)
        return ({res : {status : 500 }})
    }
}

export const postRemoval = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/postRemoval`, data, {withCredentials : true})
        return response.data
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
    }
}


//? GET all order api
export const getAllOrders = async ({page, limit}) => {
    try {
        const response = await axios.get(`${baseUrl}/getAll`,{params : {page , limit } , withCredentials : true})
        return response
    } catch (error) {
        console.log('Error calling allorders api : ', error.message)
        return ({res : {status : 500 }})
    }
}


//? update all order api
export const updateOrder = async (data) => {
    try {
        const response = await axios.patch(`${baseUrl}/update`, data ,{withCredentials : true})
        return response
    } catch (error) {
        console.log('Error calling update orders api : ', error.message)
        return ({res : {status : 500 }})
    }
}
