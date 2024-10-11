import axios from 'axios'

const baseUrl = 'http://localhost:5000'
// const baseUrl = 'https://propped-up-bay-area.onrender.com'

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/signUp`, userData, { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error in registerUser api: ', error)
        return ({res : {status : 500 }})
    }
}

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/login`, {email, password} , { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error in loginUser api: ', error)
        return ({res : {status : 500 }})
    }
}

export const adminLogin = async (phoneNumber, password) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/adminLogin`, {phoneNumber, password}, { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error in adminLogin api: ', error)
        return ({res : {status : 500 }})
    }
}
