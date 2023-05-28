import axios from 'axios';
import router from '../router';
import mongoSanitize from 'mongo-sanitize';
import xss from 'xss';

axios.defaults.baseURL = "/api"
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
let refresh = false;

axios.get('/csrf').then((response) => {
  console.log(response.data)
  localStorage.setItem("_csrf", response.data);
  axios.defaults.headers.common['X-CSRF-Token'] = response.data;
});

axios.interceptors.response.use(resp => resp, async error => {
  if (error.response.status === 401 && !refresh) {
    refresh = true;
    const { status, data } = await axios.get('/auth/refresh', {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("refresh")}`,
      }
    });
    if (status === 200) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      localStorage.setItem("token", data.access_token);
      return axios(error.config);
    }
  }
  refresh = false;
  return Promise.reject(error);
});

axios.interceptors.request.use(config => {
  config.data = mongoSanitize(config.data);
  config.params = mongoSanitize(config.params);
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 404) {
      router.push({ path: '/error/404' });
    } else if (error.response.status === 401 || error.response.status === 403) {
      router.push({ path: '/error/403' });
    }
    return Promise.reject(error);
  }
);

const filter = new xss.FilterXSS();

axios.interceptors.request.use((config) => {
  config.data = sanitize(config.data);
  return config;
});

function sanitize(data) {
  if (Array.isArray(data)) {
    return data.map(item => sanitize(item));
  } else if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  } else if (typeof data === 'string') {
    return filter.process(data);
  } else {
    return data;
  }
}