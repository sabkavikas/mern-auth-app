import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { login } from '../services/userService'
import { toast } from 'react-toastify'
import { getToken, setToken } from '../helpers/tokenHelper'

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getToken()) {
            navigate('/home', { replace: true })
        }
    }, [])
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const loginMutation = useMutation((data) => login(data), {
        onSuccess: (data) => {
            // Handle successful login
            setToken(data?.data?.token);
            navigate('/home')
            // toast.success(data?.data?.message);

        },
        onError: (error) => {
            // Handle error during login
            toast.error(error.response?.data?.message || 'An error occurred during login.');
        }
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    }
    return (
        <div className="container">
            <div className='row my-5 justify-content-center'>
                <div className='card w-50'>
                    <div className="card-header"><h2>Login</h2></div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="col mt-2">
                                <label htmlFor="inputEmail4" className="form-label">Email</label>
                                <input type="email" className="form-control" name='email' id="email" placeholder='Enter email' {...register('email', { required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } },)} />
                                {errors.email && <p className='text-danger mt-2'>{errors?.email?.message}</p>}
                            </div>
                            <div className="col mt-2">
                                <label htmlFor="inputPassword4" className="form-label" placeholder='Enter password'>Password</label>
                                <input type="password" name='password' className="form-control" id="password" placeholder='Enter password' {...register('password', { required: 'Password is required.', })} />
                                {errors.password && <p className='text-danger'>{errors?.password?.message}</p>}
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">Sign in</button>
                        </form>
                    </div>
                </div>
                <center className='mt-3'><p>Don't have an account?<Link to={'/signup'}> Signup </Link>here</p></center>
            </div>
        </div>
    )
}

export default Login