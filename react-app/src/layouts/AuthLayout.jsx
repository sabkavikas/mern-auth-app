import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getToken } from '../helpers/tokenHelper';

const AuthLayout = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (getToken()) {
            navigate('/home', { replace: true })
        }
    }, [])
    return (
        <main>{children}</main>
    )
}

export default AuthLayout