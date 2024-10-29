import axios from 'axios'

// const baseUrl = 'http://localhost:5000'
const baseUrl = 'https://propped-up-backend.vercel.app'

//? signup
export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/signUp`, userData, { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error calling registerUser api: ', error)
        return ({res : {status : 500 }})
    }
}

//? signup details
export const signUpDetails = async (userData) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/signUp/details`, userData, { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error calling signupDetails api: ', error)
        return ({res : {status : 500 }})
    }
}

//? login
export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${baseUrl}/auth/login`, {email, password} , { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error calling loginUser api: ', error)
        return ({res : {status : 500 }})
    }
}

//? login by token
export const getUserByToken = async () => {
    try {
        const res = await axios.get(`${baseUrl}/auth/login` , { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error calling getUserByToken api: ', error)
        return ({res : {status : 500 }})
    }
}

//? update password
export const updatePassword = async (data) => {
    try {
        const res = await axios.get(`${baseUrl}/auth/updatePassword`, data , { withCredentials: true })
        return res
    } catch (error) {
        console.log('Error calling updatePassword api: ', error.message)
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
