import axios from 'axios'

const baseUrl = 'http://localhost:5000'

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/signUp`, userData)
        return res
    } catch (error) {
        console.log('Error in registerUser : ', error)
    }
}

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/login`, {email, password})
        return res
    } catch (error) {
        console.log('Error in loginUser api: ', error)
    }
}

export const adminLogin = async (phoneNumber, password) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/adminLogin`, {phoneNumber, password})
        return res
    } catch (error) {
        console.log('Error in adminLogin api: ', error)
    }
}
