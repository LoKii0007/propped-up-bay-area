import axios from "axios"

const baseUrl = 'http://localhost:5000/api/orders'
// const baseUrl = 'https://propped-up-bay-area.onrender.com'
// const authToken = localStorage.getItem('authToken')

export const getOrders = async () => {
    try {
        const response = await axios.get(`${baseUrl}`)
        return response
    } catch (error) {
        console.log('Error fetching getorders api', error)
    }
}

export const openhouseOrder = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/openHouseOrder`, data, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
        return ({res : {status : 500 }})
    }
}

//? get openhouse order api
export const getOpenHouseOrder = async () => {
    try {
        const response = await axios.get(`${baseUrl}/openHouseOrder`, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching get-openHouseOrders api', error.message)
        return ({res : {status : 500 }})
    }
}

//? get post order api
export const getpostOrder = async () => {
    try {
        const response = await axios.get(`${baseUrl}/postOrder`, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching get-openHouseOrders api', error.message)
        return ({res : {status : 500 }})
    }
}


export const postOrder = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/postOrder`, data, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
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
