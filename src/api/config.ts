import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://planner.enaut.dev/api'

export const apiInstance = axios.create({
  withCredentials: true,
  baseURL,
})
