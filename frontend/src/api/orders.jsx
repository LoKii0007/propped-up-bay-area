import axios from "axios"

const baseUrl = `${import.meta.env.VITE_BASE_URL}/api/orders`

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