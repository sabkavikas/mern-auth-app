import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { removeToken } from '../helpers/tokenHelper';

const Header = () => {
    const navigate = useNavigate();
    const logout = () => {
        removeToken();
        navigate('/login', { replace: true });
    }

    return (
        <div><nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#">MERN APP</a>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to={'/home'} className="nav-link " aria-current="page" href="#">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/profile'} className="nav-link " aria-current="page" href="#">Profile</Link>
                        </li>
                    </ul>
                    <button className='btn btn-small btn-danger' onClick={logout}>Logout</button>
                </div>
            </div>
        </nav></div>
    )
}

export default Header