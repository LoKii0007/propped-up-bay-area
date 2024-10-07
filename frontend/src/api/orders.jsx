import axios from "axios"

const baseUrl = 'http://localhost:5000/api/orders'
// const baseUrl = 'https://propped-up-bay-area.onrender.com'

export const getOrders = async () => {
    try {
        const response = await axios.get(`${baseUrl}`)
        return response
    } catch (error) {
        console.log('Error fetching getorders api', error)
    }
}

export const openhouseOrders = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/openHouseOrder`, data)
        return response
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
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
