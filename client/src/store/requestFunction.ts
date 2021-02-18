import {CsrfSliceType} from "../utils/types";

export const serverRequest = (data: any, getState: any, url: string, method: 'POST' | 'PUT' | 'DELETE') => {
    const {csrfToken} = getState() as { csrfToken: CsrfSliceType }
    return fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': `${csrfToken.csrfToken}`
        }
    })
}