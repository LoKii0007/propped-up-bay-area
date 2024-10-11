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
        // if(!authToken)
        const response = await axios.post(`${baseUrl}/openHouseOrder`, data, {withCredentials : true})
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
        return ({res : {status : 500 }})
    }
}

export const postOrder = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/postOrder`, data)
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
    }
}

export const postRemoval = async (data) => {
    try {
        const response = await axios.post("http://localhost:5000/api/orders/postRemoval", data)
        return response.data
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
    }
}
