import React, { useState } from 'react';
import Services from '../service/Services'
import { useAlert } from "react-alert";
import Spinner from '../components/Spinner';
import image from '../photos/backg.jpg';

export default function LoginForm() {
    const alert = useAlert();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState("")
    const [PassError, setPassError] = useState("")
    const validation = () => {
        const errors = {}
        if (email === '') {
            errors.email = 'Enter the Email'
        }
        if (password === '') {
            errors.password = 'Enter the Address'
        }
        return Object.keys(errors).length === 0 ? null : errors;
    }
    const handlesubmit = (e) => {
        e.preventDefault();
        const errors = validation();

        if (errors) {
            setEmailError(errors.email);
            setPassError(errors.password);
        } else {
            const data = {
                userName: email,
                password: password
            };
            setLoading(true)
            Services.Common.login(data).then(function (result) {
                if (result.success == true) {
                    //console.log(result.data)
                    localStorage.setItem("token", result.data);
                    alert.success(result.message);
                    setLoading(false)
                    window.location = "/";
                } else {
                    alert.error(result.message);
                    setLoading(false)
                }
            });
        }
    };
    return (
        <div>
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50" style={{ backgroundImage: `url(${image})` }}>
                {loading && <Spinner />}
                <div>
                    <h3 className="text-4xl font-bold text-white">
                        Zaptas Technologies<br />
                        <span style={{ fontSize: '15px', textAlign: 'center', marginLeft: '108px' }}>(Invoice System)</span>
                    </h3>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={handlesubmit}>
                        <div className="mt-4">
                            <label
                                htmlFor="email" className="block text-sm font-medium text-gray-700 undefined">
                                Email<span className="text-red-500">&nbsp;*</span>
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="email"
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className='text-red-500 text-sm'>{emailError}</div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 undefined">Password<span className="text-red-500">&nbsp;*</span>
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name='password'
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div className='text-red-500 text-sm'>{PassError}</div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-red-900 border border-transparent rounded-md active:bg-red-600 false"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
