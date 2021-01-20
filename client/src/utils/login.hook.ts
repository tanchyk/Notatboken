import {useCallback, useEffect} from 'react';

const storageName: string = 'userId';

export const useLogin = () => {
    const login= useCallback((id: number | null) => {
        if(id) {
            localStorage.setItem(storageName, JSON.stringify({
                userId: id
            }))
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName)!);

        if (data && data.id) {
            login(data.id)
        }
    }, [login]);

    return  {login, logout} as const;
}