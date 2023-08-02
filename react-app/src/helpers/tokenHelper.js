export const setToken = (token) => {
    localStorage.setItem('token', token);
    return true;
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const removeToken = () => {
    localStorage.removeItem('token')
    return true;
}