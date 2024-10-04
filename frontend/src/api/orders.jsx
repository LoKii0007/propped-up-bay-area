import axios from "axios"

export const getOrders = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/orders")
        return response.data
    } catch (error) {
        console.log('Error fetching getorders api', error)
    }
}

export const openhouseOrders = async (data) => {
    try {
        const response = await axios.post("http://localhost:5000/api/orders/openhouse", data)
        return response.data
    } catch (error) {
        console.log('Error fetching openhouse orders api', error)
    }
}

export const postOrder = async (data) => {
    try {
        const response = await axios.post("http://localhost:5000/api/orders/postOrder", data)
        return response.data
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
