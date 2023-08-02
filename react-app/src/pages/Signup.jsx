import React from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/userService';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const signUpMutation = useMutation((data) => signUp(data), {
        onSuccess: (data) => {
            // Handle successful sign-up
            navigate('/login')
            toast.success(data?.data?.message);
        },
        onError: (error) => {
            // Handle error during sign-up
            toast.error(error.response?.data?.message || 'An error occurred during sign up.');
        }
    });

    const onSubmit = (data) => {
        signUpMutation.mutate(data)
    }
    return (
        <div className="container">
            <div className='row my-5 justify-content-center'>
                <center><h3>Sign Up</h3></center>
                <div className='card w-50'>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="col mt-2">
                                <label htmlFor="inputEmail4" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name='name' placeholder='Enter name' {...register('name', { required: 'Name is required.' },)} />
                                {errors.name && <p className='text-danger mt-2'>{errors?.name?.message}</p>}
                            </div>
                            <div className="col mt-2">
                                <label htmlFor="inputEmail4" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" name='email' placeholder='Enter email' {...register('email', { required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } },)} />
                                {errors.email && <p className='text-danger mt-2'>{errors?.email?.message}</p>}
                            </div>
                            <div className="col mt-2">
                                <label htmlFor="inputPassword4" className="form-label" placeholder='Enter password'>Password</label>
                                <input type="password" className="form-control" id="password" name='password' placeholder='Enter password' {...register('password', { required: 'Password is required.' },)} />
                                {errors.password && <p className='text-danger mt-2'>{errors?.password?.message}</p>}
                            </div>
                            <div className="col mt-2">
                                <label htmlFor="inputAddress" className="form-label">Phone Number</label>
                                <input type="number" className="form-control" id="phone" name='phone' placeholder="Enter phone number" {...register('phone', { required: 'Phone number is required.', minLength: { value: 10, message: 'Number is less than 10 digits' }, maxLength: { value: 10, message: 'Number is greater than 10 digits' } },)} />
                                {errors.phone && <p className='text-danger mt-2'>{errors?.phone?.message}</p>}
                            </div>
                            <div className="col mt-2">
                                <label htmlFor="inputAddress2" className="form-label">Birth Date</label>
                                <input type="date" className="form-control" id="bday" name='date' placeholder="Select birth date" {...register('date', { required: 'Date is required.' },)} />
                                {errors.date && <p className='text-danger mt-2'>{errors?.date?.message}</p>}
                            </div>
                            <fieldset className="row mt-2">
                                <legend className="col-form-label col-sm-2 pt-0">Gender</legend>
                                <div className="col ">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="gender" id="genderMale" value="male" {...register('gender', { required: 'Gender is required.' },)} />
                                        <label className="form-check-label" htmlFor="genderMale">
                                            Male
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="gender" id="genderFemale" value="female" {...register('gender', { required: 'Gender is required.' },)} />
                                        <label className="form-check-label" htmlFor="genderFemale">
                                            Female
                                        </label>
                                    </div>
                                </div>
                                {errors.gender && <p className='text-danger mt-2'>{errors?.gender?.message}</p>}
                            </fieldset>
                            {/* <div className="row mb-3">
                                <div className="col-sm-10 offset-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="gridCheck1" />
                                        <label className="form-check-label" for="gridCheck1">
                                            Example checkbox
                                        </label>
                                    </div>
                                </div>
                            </div> */}
                            <button type="submit" className="btn btn-primary mt-2">Sign Up</button>
                        </form>
                    </div>
                </div>
                <center className='mt-3'><p>Already have an account?<Link to={'/login'}> Login </Link>here</p></center>
            </div>
        </div>
    )
}

export default Signup