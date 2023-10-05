import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://127.0.0.1:3000/api',
  headers: {
    'X-API-Version': 'v1'
  }
})
