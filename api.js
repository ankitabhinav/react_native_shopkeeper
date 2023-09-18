import axios from 'axios';
import {_storeData, _retrieveData, _removeData} from './utility/asyncStorage'
import * as RootNavigation from './RootNavigation';



const instance = axios.create({
    baseURL: 'https://next-js-shopkeeper.vercel.app/api',
    //baseURL : config.production_base_url,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

instance.interceptors.request.use(
    async (config) => {
        const token = await _retrieveData('token');
        const refreshToken = await _retrieveData('refreshToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (refreshToken) {
            config.headers['Refresh-Token'] = `Bearer ${refreshToken}`
        }
        return config;
    },
    (err) => {

        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    (res) => {
        // console.log('-----s')
        // console.log(res);
        if (res.data.status === 'reset tokens') {
            _storeData('token', res.data.token);
            _storeData('refreshToken', res.data.refreshToken);
            return;
        }


        return res;
    },
    async (err) => {
        // console.log('-----')
        // console.log(err);

        if (err.response.data.status === 'tokens expired') {
            _removeData('token');
            _removeData('refreshToken');
            _removeData('name');
            _removeData('email');
            return RootNavigation.navigate('Login');
        }

        return Promise.reject(err);
    }
);

export default instance;