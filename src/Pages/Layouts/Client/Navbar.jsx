import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    // Handle the scroll event to detect scroll position
    useEffect(() => {
        const handleScroll = () => {
            // Set scrolled to true if the page is scrolled down 100px or more
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Set initial state on mount
        handleScroll();

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        // Keep width in sync immediately
        handleResize();

        console.log('Window width:', width);

        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    return (
        <>
            {
                width > 430 ? (
                    <nav className={`fixed top-0 left-0 z-20  w-full h-fit text-white flex items-center justify-between px-12 py-3 ${scrolled ? 'bg-orange-600 shadow' : 'bg-transparent'}`}>
                        <div className="flex items-center gap-2">
                            <img src="logo.png" alt="Logo" className="h-[50px] bg-orange-200 object-cover rounded-full" />
                            <span className="font-bold text-sm drop-shadow text-left">Mr. J’s Math and Engineering <br />Tutoring Services</span>
                        </div>

                        <ul className='flex items-center gap-[40px]'>
                            <a href="#home" className="hover:border-b-2 hover:border-orange-100">Home</a>
                            <a href="#services" className="hover:border-b-2 hover:border-orange-100">Services</a>
                            <a href="#reviews" className="hover:border-b-2 hover:border-orange-100">Reviews</a>
                            <a href="#about" className="hover:border-b-2 hover:border-orange-100">About</a>
                            <a href="#contact" className="hover:border-b-2 hover:border-orange-100">Contact</a>
                        </ul>

                        <Link to='/enroll'>
                            <Button className='bg-slate-700 rounded-full shadow hover:bg-slate-800 hover:text-white'>Enroll Now</Button>
                        </Link>
                    </nav>
                )
                    :
                    (
                        <nav className={`fixed top-0 left-0 z-20  w-full h-fit text-white flex items-center justify-between px-4 py-3 ${scrolled ? 'bg-orange-600 shadow' : 'bg-transparent'}`}>
                            <Drawer direction='top'>
                                <DrawerTrigger asChild>
                                    <Button size="sm" className="bg-orange-200 text-black rounded-md shadow hover:bg-orange-300">
                                        <RxHamburgerMenu size={20} />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className='bg-orange-500 text-white h-screen'>
                                    <DrawerHeader className='flex justify-center items-center py-16'>
                                        <div className="w-[80px] h-[80px] bg-orange-200 rounded-xl mb-2">
                                            <img src="logo.png" alt="Logo" className="object-cover" />
                                        </div>

                                        <p className="text-xl font-bold drop-shadow">
                                            Mr. J’s Math and Engineering <br />Tutoring Services
                                        </p>

                                        <div className="flex flex-col items-center space-y-6 text-2xl my-4">
                                            <a href="#home">Home</a>
                                            <a href="#services">Services</a>
                                            <a href="#reviews">Reviews</a>
                                            <a href="#about">About</a>
                                            <a href="#contact">Contact</a>
                                        </div>


                                        <Link to='/enroll' className='rounded-full w-[150px] h-[50px] flex items-center justify-center bg-white text-black shadow hover:bg-slate-800 hover:text-white'>Enroll Now</Link>


                                        <DrawerClose asChild className='absolute top-4 right-4 shadow bg-orange-300 text-black hover:bg-slate-700 hover:text-white'>
                                            <Button size='sm'>X</Button>
                                        </DrawerClose>
                                    </DrawerHeader>
                                </DrawerContent>
                            </Drawer>
                        </nav>
                    )
            }
        </>
    )
}
