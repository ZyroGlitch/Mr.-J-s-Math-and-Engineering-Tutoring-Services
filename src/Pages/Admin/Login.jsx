import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import supabase from '@/supabase-client'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState(
        {
            username: '',
            password: '',
        },
    );

    const fileSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('user_tbl')
            .select('*')
            .eq('username', formData.username)
            .eq('password', formData.password);

        if (data && data.length > 0) {
            console.log('Login successful, user:', data[0]);
            toast.success("Login successful!");
            resetForm();

            navigate('/admin-dashboard');
        } else {
            toast.error("Invalid username or password. Please try again.");
        }
    }

    const resetForm = () => {
        setShowPassword(false);
        setFormData({
            username: '',
            password: '',
        });
    }



    return (
        <>
            <section className="relative h-screen overflow-hidden">
                <img
                    src="/background.svg"
                    alt="image"
                    className="absolute inset-0 h-screen w-full object-cover"
                />

                <div className="bg-blue-500 opacity-50 absolute h-screen w-full"></div>

                <div
                    className="bg-slate-50 rounded-lg shadow-xl min-h-10 absolute py-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <div className="px-12 mb-4">
                        <div className="h-[125px] w-full flex justify-center">
                            <img src="/logo.png" alt="Logo" className="object-cover" />

                        </div>

                        <p className="text-md font-bold drop-shadow">
                            Mr. J’s Math and Engineering <br /> Tutoring Services
                        </p>
                    </div>

                    <form onSubmit={fileSubmit} className='px-4'>
                        <div className="min-h-fit mb-2">
                            <Label htmlFor="email" className="text-xs font-medium text-gray-700 mb-1">
                                Username
                            </Label>
                            <Input
                                type="text"
                                id='username'
                                placeholder='Enter your username'
                                className='w-full rounded-md border border-slate-500/50 focus-visible:border-blue-600 focus-visible:ring-0'
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    username: e.target.value
                                })}
                            />
                        </div>

                        <div className="min-h-fit mb-2">
                            <Label htmlFor="password" className="text-xs font-medium text-gray-700 mb-1">
                                Password
                            </Label>
                            <div className='relative'>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    placeholder='Enter your password'
                                    className='w-full rounded-md border border-slate-500/50 pr-10 focus-visible:border-blue-600 focus-visible:ring-0'
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {
                                        showPassword ? <EyeOff size={16} />
                                            : <Eye size={16} />
                                    }
                                </button>
                            </div>
                        </div>

                        <Link to="/forgot-password" className="text-xs text-blue-700 hover:underline mb-4 text-end block">
                            Forgot your password?
                        </Link>

                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md">
                            Login
                        </Button>
                    </form>
                </div>
            </section>
        </>
    )
}
