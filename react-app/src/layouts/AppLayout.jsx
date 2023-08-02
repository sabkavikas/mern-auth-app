import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import { getToken } from '../helpers/tokenHelper';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!getToken()) {
            navigate('/login', { replace: true })
        }
    }, [])
    return (
        <div >
            <Header />
            <main>{children}</main>
        </div>
    )
}

export default AppLayout