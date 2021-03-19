import {CsrfSliceType} from "../utils/types";

const configureUrl = (url: string) => {
    let serverUrl: string;
    if(process.env.NODE_ENV === 'production') {
        serverUrl = `${process.env.REACT_APP_BACK_END}${url}`;
    } else {
        serverUrl = '/api' + url;
    }
    return serverUrl;
}

export const getRequest = (url: string) => {
    const serverUrl = configureUrl(url);

    return fetch(serverUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const ppdRequest = (csrfToken: string, data: any, url: string, method: 'POST' | 'PUT' | 'DELETE') => {
    const serverUrl = configureUrl(url);

    return fetch(serverUrl, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': `${csrfToken}`
        }
    })
}

export const serverRequest = (data: any, getState: any, url: string, method: 'POST' | 'PUT' | 'DELETE') => {
    const serverUrl = configureUrl(url);

    const {csrfToken} = getState() as { csrfToken: CsrfSliceType }

    return fetch(serverUrl, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': `${csrfToken.csrfToken}`
        }
    })
}