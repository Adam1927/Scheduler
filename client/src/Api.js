import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api',
  headers: {
    'X-API-Version': 'v1'
  },
  withCredentials: true
})
