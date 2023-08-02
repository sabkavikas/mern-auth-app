import React, { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import '../assets/profile.css'
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { deleteProfile, getProfile, updateProfile } from '../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../helpers/tokenHelper';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
    const navigate = useNavigate();

    let {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            date: '',
            gender: ''
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    const { data, error } = useQuery('user', getProfile, {
        onSuccess: (response) => {
            reset()
            reset(response?.data?.user);
            setIsLoading(false);
        },
        onError: (error) => {
            console.log('Error', error);
            toast.error(error.response?.data?.message || 'An error occurred.');
            setIsLoading(false);
        },
        refetchOnWindowFocus: false,
        enabled: isLoading,
        retry: 0
    });


    const profileMutation = useMutation((data) => updateProfile(data), {
        onSuccess: (data) => {
            // Handle successful 
            toast.success(data?.data?.message);
            setIsLoading(true);
        },
        onError: (error) => {
            // Handle error during profile update
            toast.error(error.response?.data?.message || 'An error occurred .');
            setIsLoading(false);
        }
    });

    const deleteAccountMutation = useMutation((data) => deleteProfile(data), {
        onSuccess: (data) => {
            // Handle successful 
            toast.success(data?.data?.message);
            removeToken();
            navigate('/login', { replace: true });
        },
        onError: (error) => {
            // Handle error during profile update
            toast.error(error?.response?.data?.message || 'An error occurred .');
            setIsLoading(false);
        }
    });

    // useEffect(() => {

    // },[isLoading])

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', data.phone);
        formData.append('gender', data.gender);
        formData.append('date', data.date);
        formData.append('profilePic', data.profilePic[0]);
        profileMutation.mutate(formData);
    }

    const deleteAccount = (userId) => {
        deleteAccountMutation.mutate(userId);
    }
    return (
        <AppLayout>
            <div className="container mt-4">
                <div className="row gutters">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src={`${BASE_URL}/profile/${data?.data?.user?.profilePic}`} alt="Maxwell Admin" />
                                        </div>
                                        <h5 className="user-name">{data?.data?.user?.name}</h5>
                                        <h6 className="user-email">{data?.data?.user?.email}</h6>
                                    </div>
                                    <div className="about">
                                        <h5>About</h5>
                                        <p>I'm {data?.data?.user?.name}. Full Stack Designer I enjoy creating user-centric, delightful and human experiences.</p>
                                    </div>
                                </div>
                                <button className='btn btn-danger' onClick={() => deleteAccount(data?.data?.user?.id)}>Delete Account</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}><div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 className="mb-2 text-primary">Personal Details</h6>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="fullName"> Name</label>
                                            <input type="text" className="form-control" id="name" name='name' placeholder='Enter name' {...register('name', { required: 'Name is required.' },)} />
                                            {errors.name && <p className='text-danger mt-2'>{errors?.name?.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="eMail">Email</label>
                                            <input type="email" className="form-control" id="email" name='email' placeholder='Enter email' {...register('email', { required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } },)} />
                                            {errors.email && <p className='text-danger mt-2'>{errors?.email?.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="phone">Password</label>
                                            <input type="password" className="form-control" id="password" name='password' placeholder='Enter password' {...register('password',)} />
                                            {errors.password && <p className='text-danger mt-2'>{errors?.password?.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="number" className="form-control" id="phone" name='phone' placeholder="Enter phone number" {...register('phone', { required: 'Phone number is required.', minLength: { value: 10, message: 'Number is less than 10 digits' }, maxLength: { value: 10, message: 'Number is greater than 10 digits' } },)} />
                                            {errors.phone && <p className='text-danger mt-2'>{errors?.phone?.message}</p>}
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="phone">Birth Date</label>
                                            <input type="date" className="form-control" id="bday" name='date' placeholder="Select birth date" {...register('date', { required: 'Date is required.' },)} />
                                            {errors.date && <p className='text-danger mt-2'>{errors?.date?.message}</p>}
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-2">
                                        <fieldset className="row mt-2">
                                            <legend className="col-form-label col-sm-3 pt-0">Gender</legend>
                                            <div className="col">
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
                                    </div>
                                    <div className="col mt-2">
                                        <div className="form-group">
                                            <label htmlFor="phone">Profile Picture</label>
                                            <input type="file" className="form-control" id="bday" name='profilePic' placeholder="Browse file" {...register('profilePic',)} />
                                        </div>
                                    </div>
                                </div>
                                    <div className="row gutters">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2">
                                            <div className="text-right">
                                                {/* <button type="button" id="submit" name="submit" className="btn btn-secondary">Cancel</button> */}
                                                <button type="submit" id="submit" name="submit" className="btn btn-primary">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Profile