
import { UserRound } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { BsBag, BsBarChartLine } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa6";
import { LuSquareArrowLeft } from "react-icons/lu";
import { Link, Outlet } from 'react-router-dom';
import { MdKeyboardArrowRight } from "react-icons/md";
import supabase from '@/supabase-client';
import { CiMail } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar"
import { IoBookOutline } from "react-icons/io5";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeLink, setActiveLink] = useState(1);

    const [openSubBooking, setOpenSubBooking] = useState(false);
    const [activeBookingSubLink, setActiveBookingSubLink] = useState(0);

    const [bookingRequests, setBookingRequests] = useState({
        requested: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
    });

    const [sidebarLinks] = useState([
        { id: 1, navigate: '/admin-dashboard', icon: <BsBarChartLine size={20} />, name: 'Dashboard' },
        { id: 2, navigate: '/admin-booking', icon: <BsBag size={20} />, name: 'Booking', hasSubMenu: true },
        { id: 3, navigate: '/admin-services', icon: <IoBookOutline size={20} />, name: 'Services' },
        { id: 4, navigate: '/admin-messages', icon: <FaRegEnvelope size={20} />, name: 'Messages' },
        { id: 5, navigate: '/admin-profile', icon: <UserRound size={20} />, name: 'Profile' },
    ]);

    const subMenu_Booking = [
        { id: 1, navigate: '/admin-add-booking', name: 'Add Booking' },
        { id: 2, navigate: '/admin-request-booking', name: 'Request', count: bookingRequests.requested },
        { id: 3, navigate: '/admin-pending-booking', name: 'Pending', count: bookingRequests.pending },
        { id: 4, navigate: '/admin-confirmed-booking', name: 'Confirmed', count: bookingRequests.confirmed },
        { id: 5, navigate: '/admin-completed-booking', name: 'Completed', count: bookingRequests.completed }
    ];

    // -------------------------------------------------------------------------------

    // Get the Dynamic Navbar Title based on Active Link
    const activeMainLink = sidebarLinks.find((link) => link.id === activeLink);
    const navbarTitle = activeMainLink?.name || 'Dashboard';

    // -------------------------------------------------------------------------------

    // Realtime Booking Status Counts in Sidebar
    const fetchBookingStatusCounts = useCallback(async () => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .select('booking_status');

        if (error) {
            console.log('Error fetching booking status counts:', error);
            return;
        }

        const counts = {
            requested: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
        };

        data.forEach((item) => {
            const statusKey = String(item.booking_status ?? '').toLowerCase();

            if (statusKey in counts) {
                counts[statusKey] += 1;
            }
        });

        setBookingRequests(counts);
    }, []);

    const setupBookingStatusRealtime = useCallback(() => {
        fetchBookingStatusCounts();

        const bookingChannel = supabase
            .channel('booking-status-counts')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'booking_tbl' },
                () => {
                    fetchBookingStatusCounts();
                }
            )
            .subscribe((status) => {
                console.log('Realtime booking channel status:', status);
            });

        const pollInterval = setInterval(() => {
            fetchBookingStatusCounts();
        }, 5000);

        return () => {
            clearInterval(pollInterval);
            supabase.removeChannel(bookingChannel);
        };
    }, [fetchBookingStatusCounts]);

    useEffect(() => {
        const cleanup = setupBookingStatusRealtime();
        return cleanup;
    }, [setupBookingStatusRealtime]);

    // -------------------------------------------------------------------------------

    return (
        <>
            <div className="flex overflow-hidden">
                {/* Sidebar Content */}
                <div
                    className={`flex-col justify-between bg-white h-screen border-r border-slate-200 shadow-xl duration-300 hidden lg:flex ${isSidebarOpen ? 'w-[250px]' : 'w-[60px]'}`}
                >
                    <div>
                        <div className="px-4 border-b border-slate-300 mb-3">
                            <div className={`relative inline-flex items-center w-full ${isSidebarOpen ? 'gap-2' : 'justify-center'}`}>
                                <div className="h-[80px] w-[80px] flex items-center justify-center">
                                    <img src="logo.png" alt="Logo" className="object-cover" />
                                </div>
                                <p className="text-xs font-bold drop-shadow text-left">Mr. J’s Math and Engineering <br />Tutoring Services</p>
                            </div>
                        </div>

                        {/* Sidebar Links */}
                        <ul className="space-y-1 mx-2.5">
                            {sidebarLinks.map((link) => (
                                <div key={link.id}>
                                    <Link
                                        to={link.navigate}
                                        onClick={() => {
                                            setActiveLink(link.id)

                                            if (link.id === 2) {
                                                setOpenSubBooking((prev) => !prev);
                                            } else {
                                                setOpenSubBooking(false);
                                            }
                                        }}
                                        className={`flex justify-between items-center gap-2 rounded px-3 py-1.5 cursor-pointer ${activeLink === link.id ? 'bg-blue-500 text-white' : 'bg-transparent hover:bg-slate-200'} ${!isSidebarOpen && 'justify-center'}`}
                                    >
                                        <span className='flex items-center gap-2'>
                                            {link.icon}
                                            <p className={`text-sm w-full text-left ${!isSidebarOpen && 'opacity-0 scale-0 absolute'}`}>{link.name}</p>
                                        </span>

                                        <span>
                                            {
                                                link.hasSubMenu && (
                                                    <MdKeyboardArrowRight size={20} className={`transition-transform duration-300
                                                        ${openSubBooking && link.id === 2 ? 'rotate-90' : ''}
                                                        `}
                                                    />
                                                )
                                            }
                                        </span>

                                    </Link>

                                    {/* Sidebar SubLinks */}
                                    {
                                        openSubBooking && link.id === 2 ? (
                                            <ul className="space-y-1 ms-[20px] py-2">
                                                {
                                                    subMenu_Booking.map((sublink) => (
                                                        <Link
                                                            key={sublink.id}
                                                            to={sublink.navigate}
                                                            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer
                                                                ${activeBookingSubLink === sublink.id ? 'border-l-2 border-blue-500 bg-blue-100' : 'bg-transparent hover:bg-slate-100'}
                                                                ${!isSidebarOpen && 'justify-center'}`
                                                            }
                                                            onClick={() => setActiveBookingSubLink(sublink.id)}
                                                        >
                                                            <p className={`text-sm w-full text-left flex justify-between items-center ${!isSidebarOpen && 'opacity-0 scale-0 absolute'}`}>
                                                                <span>{sublink.name}</span>
                                                                <span className='text-blue-500 text-xs'>{sublink.count}</span>
                                                            </p>
                                                        </Link>
                                                    ))
                                                }
                                            </ul>
                                        ) : null
                                    }
                                </div>
                            ))}
                        </ul>
                    </div>

                    {/* Logout Section */}
                    <ul className="space-y-2 mx-2.5 mb-3">
                        <Link to='/admin-portal' className={`flex items-center gap-2 rounded bg-transparent px-3 py-1.5 cursor-pointer hover:bg-slate-200 ${!isSidebarOpen && 'justify-center'}`}>
                            <LuSquareArrowLeft className='text-lg' />
                            <p className={`text-sm w-full text-left ${!isSidebarOpen && 'opacity-0 scale-0 absolute'}`}>Logout</p>
                        </Link>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="bg-white h-screen w-full overflow-y-auto flex flex-col">
                    <nav className="sticky top-0 z-20 flex justify-between items-center bg-white max-h-[50px] w-full shadow px-8 py-7 shrink-0">
                        <div>
                            <p className="text-xl hidden text-slate-700 lg:block">{navbarTitle}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className='flex items-center gap-2'>
                                <Link
                                    to='#'
                                    className="bg-slate-100 rounded-lg hover:scale-105 hover:transition-transform hover:duration-300 hover:bg-slate-200 p-1.5"
                                >
                                    <CiMail size={20} className='' />
                                </Link>

                                <Link
                                    to='#'
                                    className="bg-slate-100 rounded-lg hover:scale-105 hover:transition-transform hover:duration-300 hover:bg-slate-200 p-1.5"
                                >
                                    <IoNotificationsOutline size={20} className='' />
                                </Link>
                            </div>


                            <Link
                                to='#'
                                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:transition-transform hover:duration-300 hover:bg-slate-200"
                            >
                                <div className="border border-slate-200 rounded-full">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                                    </Avatar>
                                </div>


                                <div className='text-left'>
                                    <p className="text-xs font-semibold">John Doe</p>
                                    <p className="text-xs text-gray-500">john.doe@example.com</p>
                                </div>
                            </Link>
                        </div>
                    </nav>

                    {/* Dynamic Content */}
                    <div className="px-8 py-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
