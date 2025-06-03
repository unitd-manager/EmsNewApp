import axios from 'axios'

const api = axios.create({
baseURL: 'http://43.228.126.245:4023',
//baseURL: 'http://localhost:5009'
});

export default api