import React, { useEffect, useState } from 'react'
import Navbar from '../Layouts/Client/Navbar'
import { TypeAnimation } from 'react-type-animation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MdMenuBook } from "react-icons/md";
import supabase from '@/supabase-client';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"
import { IoTimeOutline } from "react-icons/io5";
import { CiMoneyCheck1 } from "react-icons/ci";
import { RiComputerLine, RiFacebookFill } from "react-icons/ri";
import { FaEnvelope, FaPeopleGroup } from "react-icons/fa6";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { PiBookOpenText } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css';


export default function Landing() {

    const [activeTab, setActiveTab] = useState("tutor")

    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Load data on landing page call
    useEffect(() => {
        fetchSubjects();
        crashCourses();
        initializeDummyReviews();

        AOS.init({
            duration: 1000,  // Optional: Duration for the animation
            easing: 'ease-in-out', // Optional: Easing effect for the animation
        });
    }, []);

    // -------------------------------------------------------------------------------------------

    // Tutor Services
    const fetchSubjects = async () => {
        const { data, error } = await supabase
            .from('subject_description')
            .select('*');

        if (error) {
            console.error('Error fetching subjects:', error);
        } else {
            setSubjects(data ?? []);
            console.log('Fetched subjects:', data);
        }
    };

    const fetchTopics = async (subject_id) => {
        setLoadingTopics(true);
        const { data, error } = await supabase
            .from('tutor_services_tbl')
            .select('id, topic, description, difficulty')
            .eq('subject_id', subject_id);

        if (error) {
            console.error('Error fetching topics:', error);
            setTopics([]);
        } else {
            setTopics(data ?? []);
        }

        setLoadingTopics(false);
    };

    const handleSubjectClick = async (subject) => {
        setCourseDetailsOpen(false);
        setSelectedSubject(subject);
        setDetailsOpen(true);
        await fetchTopics(subject.id);
    };

    // -------------------------------------------------------------------------------------------

    const [crash_courses, setCrashCourses] = useState([]);
    const [courseDetailsOpen, setCourseDetailsOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [viewSelectedCourse, setViewSelectedCourse] = useState(null);
    const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);


    // Fetch All List of Crash Courses
    const crashCourses = async () => {
        const { data, error } = await supabase
            .from('crash_courses_tbl')
            .select('*');

        if (error) {
            console.error('Error fetching crash courses:', error);
        } else {
            setCrashCourses(data ?? []);
            console.log('Fetched crash courses:', data);
        }
    };

    // View Crash Course Details
    const viewCourseDetails = async (courseId) => {
        setLoadingCourseDetails(true);
        const { data, error } = await supabase
            .from('crash_courses_tbl')
            .select('*')
            .eq('id', courseId);

        if (error) {
            console.error('Error fetching course details:', error);
            setViewSelectedCourse(null);
        } else {
            setViewSelectedCourse(data?.[0] ?? null);
            console.log('Fetched crash courses details:', data);
        }

        setLoadingCourseDetails(false);
    };

    const handleCourseClick = async (course) => {
        setDetailsOpen(false);
        setViewSelectedCourse(null);
        setCourseDetailsOpen(true); // Trigger the course details dialog
        await viewCourseDetails(course.id);
    };

    // -------------------------------------------------------------------------------------------


    // Initialize Dummy Reviews
    const initializeDummyReviews = () => {
        const dummyReviews = [
            {
                id: 1,
                student_name: 'Emily Johnson',
                course_taken: 'Advanced Mathematics',
                rating: 5,
                review_text: 'Excellent tutoring service! The instructors are knowledgeable and patient. I improved my grades significantly.'
            },
            {
                id: 2,
                student_name: 'Michael Chen',
                course_taken: 'Physics Essentials',
                rating: 4,
                review_text: 'Very helpful and flexible scheduling. The crash course preparation was thorough and well-organized.'
            },
            {
                id: 3,
                student_name: 'Sarah Williams',
                course_taken: 'SAT Math Prep',
                rating: 5,
                review_text: 'Fantastic experience! The tutors made complex concepts easy to understand. My test scores improved!'
            },
            {
                id: 4,
                student_name: 'Sarah Williams',
                course_taken: 'SAT Math Prep',
                rating: 5,
                review_text: 'Fantastic experience! The tutors made complex concepts easy to understand. My test scores improved!'
            },
            {
                id: 5,
                student_name: 'Sarah Williams',
                course_taken: 'SAT Math Prep',
                rating: 5,
                review_text: 'Fantastic experience! The tutors made complex concepts easy to understand. My test scores improved!'
            },
        ];
        setReviews(dummyReviews);
    };

    // -------------------------------------------------------------------------------------------


    return (
        <>
            {/* Homepage Section */}
            <section id='home' className="relative h-screen overflow-hidden text-slate-700 max-[430px]:px-3">
                <img
                    src="/landing_background.svg"
                    alt="Students learning with tutors"
                    className="absolute inset-0 h-screen w-full object-cover"
                />

                <img
                    src="group-people.png"
                    alt="Students learning with tutors"
                    className="absolute left-[3rem] top-[55%] translate-y-[-55%] z-10 h-[370px] object-cover max-[430px]:left-1/2 max-[430px]:top-[28%] max-[430px]:h-[220px] max-[430px]:-translate-x-1/2"
                />

                <img
                    src="calculator.png"
                    alt="image"
                    className='h-[50px] object-cover absolute top-[18vh] left-[18vh] z-10 animate-bounce max-[430px]:h-[35px] max-[430px]:top-[11vh] max-[430px]:left-[28%]'
                    style={{ animationDelay: '0s' }}
                />
                <img
                    src="DNA.png"
                    alt="image"
                    className='h-[50px] object-cover absolute top-[15vh] left-[60vh] z-10 animate-bounce max-[430px]:h-[35px] max-[430px]:top-[11vh] max-[430px]:left-[70%]'
                    style={{ animationDelay: '2s' }}
                />
                <img
                    src="write.png"
                    alt="image"
                    className='h-[50px] object-cover absolute top-[45vh] left-[78vh] z-10 animate-bounce max-[430px]:h-[35px] max-[430px]:top-[25vh] max-[430px]:left-[82%]'
                    style={{ animationDelay: '4s' }}
                />
                <img
                    src="electron.png"
                    alt="image"
                    className='h-[50px] object-cover absolute top-[65vh] left-[10vh] z-10 animate-bounce max-[430px]:h-[35px] max-[430px]:top-[33vh] max-[430px]:left-[20%]'
                    style={{ animationDelay: '6s' }}
                />
                <img
                    src="robot.png"
                    alt="image"
                    className='h-[50px] object-cover absolute top-[80vh] left-[35vh] z-10 animate-bounce max-[430px]:h-[35px] max-[430px]:top-[40vh] max-[430px]:left-[45%]'
                    style={{ animationDelay: '8s' }}
                />

                <span
                    className="absolute z-10 top-[50%] translate-y-[-50%] right-[5%] text-5xl w-[650px] text-left text-white font-bold drop-shadow-xl max-[430px]:text-center max-[430px]:text-xl max-[430px]:top-[50%] max-[430px]:right-[5%] max-[430px]:w-[85%]"
                >
                    <TypeAnimation
                        sequence={[
                            'Learn Everyday & gain new knowledge with Professional Instructors.',
                            5000,
                            'Affordable, Flexible, and Personalized Tutoring Services for All Ages.',
                            5000,
                            'Achieve Your Academic Goals with Expert Tutors and Comprehensive Support.',
                            5000,
                            'Unlock Your Potential with Our Tailored Tutoring Solutions.',
                            5000,
                        ]}
                        wrapper="span"
                        speed={150}
                        repeat={Infinity}
                    />
                </span>

                <Navbar />
            </section>

            {/* Services Section */}
            <section id='services' className="h-full py-20 px-12 bg-slate-50">
                <div className="flex justify-center mb-8">
                    <div className="w-[600px]">
                        <h2 className="text-3xl font-bold drop-shadow text-orange-500 mx-[5rem] pb-2 border-b-2 border-orange-500" data-aos="fade-right">SERVICES WE OFFER</h2>

                        <p data-aos="fade-left">
                            We offer a wide range of tutoring services to cater to the diverse needs of our students. Whether you’re looking for personalized one-on-one tutoring, comprehensive board exam preparation, or intensive crash courses, we have you covered. Our expert tutors are here to support you every step of the way on your learning journey.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="tutor" className="mb-8 flex w-full flex-col items-center">
                    <TabsList className="flex justify-evenly items-center gap-4 w-fit  px-8 py-2 mb-6 bg-transparent">
                        <TabsTrigger
                            value="tutor"
                            onClick={() => setActiveTab("tutor")}
                            className={` border-orange-500 text-orange-500 rounded-full px-4 py-2 ${activeTab === 'tutor' ? 'bg-orange-500 text-white shadow-md hover:text-white' : ''}`}
                        >
                            Tutor Services
                        </TabsTrigger>
                        <TabsTrigger
                            value="board-exam"
                            onClick={() => setActiveTab("board-exam")}
                            className={` border-orange-500 text-orange-500 rounded-full px-4 py-2 ${activeTab === 'board-exam' ? 'bg-orange-500 text-white shadow-md hover:text-white' : ''}`}
                        >
                            Board Exam Preparation
                        </TabsTrigger>
                        <TabsTrigger
                            value="courses"
                            onClick={() => setActiveTab("courses")}
                            className={` border-orange-500 text-orange-500 rounded-full px-4 py-2 ${activeTab === 'courses' ? 'bg-orange-500 text-white shadow-md hover:text-white' : ''}`}
                        >
                            Crash Courses
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tutor" className="w-full" >
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 auto-rows-fr" data-aos="fade-down">
                            {
                                subjects.map((data) => (
                                    <div
                                        className="relative h-full min-h-[160px] group cursor-pointer"
                                        key={data.id}
                                        onClick={() => handleSubjectClick(data)}
                                    >
                                        <div className="relative z-10 h-full text-left rounded-xl bg-white p-4 drop-shadow transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden">
                                            <MdMenuBook className='text-[40px] mb-3' />

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold">{data.subject}</h3>
                                                <p className="text-sm text-slate-700">
                                                    {data.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-xl bg-orange-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    </div>
                                ))
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="courses" className="w-full">
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 auto-rows-fr" data-aos="fade-down">
                            {
                                crash_courses.map((course) => (
                                    <div
                                        className="relative h-full min-h-[160px] group cursor-pointer"
                                        key={course.id}
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        <div className="relative z-10 h-full rounded-xl bg-white p-4 drop-shadow transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden">
                                            <div className="min-h-[100px] w-full mb-2">
                                                <img src="crash_courses.jpg" alt="Image" className="object-cover rounded-lg" />
                                            </div>

                                            <div className="text-left mb-2 flex-col space-y-1">
                                                <h3 className="text-xl font-bold text-orange-500">{course.title}</h3>

                                                <div className="flex items-center gap-1 text-xs">
                                                    <IoTimeOutline className='text-sm' />
                                                    <p> {course.hours} Hours ({course.session} Sessions)</p>
                                                </div>

                                                <h4 className='text-lg font-semibold'>P{course.price}</h4>
                                            </div>

                                            <Button size="sm" className='w-full'>View Details</Button>
                                        </div>

                                        <div className="pointer-events-none absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-xl bg-orange-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    </div>
                                ))
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Reviews Section */}
            <section id='reviews' className="h-full py-20 px-12 text-white relative overflow-hidden">
                <img
                    src="/landing_background.svg"
                    alt="Students learning with tutors"
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                />

                <div className="flex justify-center mb-12 relative z-10">
                    <div className="w-[600px]">
                        <h2 className="text-3xl font-bold drop-shadow mx-[5rem] pb-2 border-b-2 border-orange-100"
                            data-aos="fade-right"
                        >STUDENTS REVIEWS</h2>

                        <p className='drop-shadow' data-aos="fade-left">
                            Hear from our students about their experiences with our tutoring services. We take pride in providing personalized and effective support to help our students achieve their academic goals. Read on to see how we’ve made a difference in their learning journeys.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 w-full relative z-10">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.33%-1rem)] rounded-xl bg-white p-6 drop-shadow transition-all duration-1000 hover:shadow-xl overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                        {review.student_name.charAt(0)}
                                    </div>
                                    <div className="flex-col">
                                        <h4 className="font-semibold text-slate-900 text-sm text-left">{review.student_name}</h4>
                                        <p className="text-xs text-slate-600 text-left">{review.course_taken}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-slate-600'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-left text-slate-700">
                                {review.review_text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section id='about' className="h-full py-20 px-12 bg-slate-50">
                <div className="flex justify-center mb-16">
                    <div className="w-[600px]">
                        <h2 className="text-3xl font-bold drop-shadow text-orange-500 mx-[5rem] pb-2 border-b-2 border-orange-500" data-aos="fade-right">ABOUT US</h2>

                        <p data-aos="fade-left">
                            At Mr. J’s Math and Engineering Tutoring Services, we provide high-quality, personalized support for students of all ages. Our experienced tutors offer one-on-one tutoring, board exam preparation, and crash courses in a positive learning environment that helps every student reach their full potential.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 h-full flex flex-col justify-between">
                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <RiComputerLine className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Flexible Schedule</h3>
                                <p className="text-sm text-gray-500">We offer flexible scheduling to accommodate your busy lifestyle.</p>
                            </div>
                        </div>

                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <FaPeopleGroup className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Qualified Experts</h3>
                                <p className="text-sm text-gray-500">
                                    We bring together top professionals and experts with specialized knowledge in diverse fields to offer high-quality education and guidance.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <FaRegFaceSmileBeam className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Personalized Learning</h3>
                                <p className="text-sm text-gray-500">
                                    Adapts to individual learning styles, providing a teaching experience that’s both friendly and advanced, ensuring maximum understanding and growth.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 min-h-10 flex items-center justify-center">
                        <img src="CEO.png" alt="image" className="object-cover" />
                    </div>

                    <div className="col-span-3 h-full flex flex-col justify-between">
                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <CiGlobe className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Global Education</h3>
                                <p className="text-sm text-gray-500">
                                    Connects students and instructors from around the world, providing a platform for learning across various subjects, at any time, from anywhere.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <PiBookOpenText className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Diverse Subjects</h3>
                                <p className="text-sm text-gray-500">
                                    From languages to sciences, we offer a wide range of subjects, allowing students to explore their passions and expand their knowledge base.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2" data-aos="fade-up"
                            data-aos-anchor-placement="center-bottom">
                            <div className="flex">
                                <GrMoney className='text-4xl text-orange-500' />
                            </div>

                            <div className="flex-col text-left">
                                <h3 className="text-xl font-bold">Affordable Rates</h3>
                                <p className="text-sm text-gray-500">
                                    We strive to make learning accessible by offering competitive and affordable hourly rates without compromising on quality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <footer id='contact' className="h-full pt-16 pb-6 px-12 bg-orange-400 relative overflow-hidden">
                <img
                    src="/landing_background.svg"
                    alt="Students learning with tutors"
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                />

                <div className="grid grid-cols-12 gap-2 mb-12 relative z-10">
                    <div className="col-span-4 min-h-10 flex-col gap-4">
                        <div className="flex gap-2">
                            <img src="logo.png" alt="Logo" className="object-cover h-[50px] w-[50px] rounded-lg mt-1 shadow" />
                            <p className="text-xl font-bold text-white text-left drop-shadow">Mr. J’s Math and Engineering Tutoring Services</p>
                        </div>
                    </div>
                    <div className="col-span-2 min-h-10 flex flex-col text-left">
                        <h3 className="text-lg font-bold text-white drop-shadow mb-4">Quick Links</h3>

                        <ul className="flex flex-col gap-3">
                            <a href="#home" className="text-white hover:text-slate-700 drop-shadow">Home</a>
                            <a href="#services" className="text-white hover:text-slate-700 drop-shadow">Services</a>
                            <a href="#reviews" className="text-white hover:text-slate-700 drop-shadow">Reviews</a>
                            <a href="#about" className="text-white hover:text-slate-700 drop-shadow">About</a>
                            <a href="#contact" className="text-white hover:text-slate-700 drop-shadow">Contact</a>
                        </ul>

                    </div>
                    <div className="col-span-3 min-h-10flex flex-col text-left">
                        <h3 className="text-lg font-bold text-white drop-shadow mb-4">Contact Us</h3>

                        <ul className="flex flex-col gap-3">
                            <a
                                href="https://www.facebook.com/MrJMathEnginnering"
                                target="_blank"
                                className="text-white hover:text-slate-700 flex items-center gap-2 drop-shadow"
                            >
                                <FaFacebook className="text-2xl" />
                                <p className="text-sm">Mr.J Math Enginnering</p>
                            </a>
                            <a
                                className="text-white hover:text-slate-700 flex items-center gap-2 drop-shadow"
                                target="_blank"
                            >
                                <FiPhone className="text-2xl" />
                                <p className="text-sm">0967 429 3747</p>
                            </a>
                            <a
                                href="mailto:mrjtutoringservices@gmail.com"
                                className="text-white hover:text-slate-700 flex items-center gap-2 drop-shadow"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <MdOutlineEmail className="text-2xl" />
                                <p className="text-sm">Email Us</p>
                            </a>
                        </ul>
                    </div>
                    <div className="col-span-3 min-h-10 text-left">
                        <div className="mb-4">
                            <p className="text-2xl font-bold text-white drop-shadow">
                                Start Your Learning Journey with Us Today!
                            </p>
                            <p className="text-sm text-white drop-shadow">
                                Enroll Now and Unlock Your Full Potential.
                            </p>
                        </div>

                        <Button className='bg-slate-700 hover:bg-slate-800 shadow'>Enroll Now <FaArrowRightLong className="inline-block ml-2" /></Button>
                    </div>
                </div>

                <div className="flex justify-center items-center w-full text-white text-sm border-t border-orange-100 pt-4 drop-shadow relative z-10">
                    &copy; {new Date().getFullYear()} Mr. J’s Math and Engineering Tutoring Services. All rights reserved.
                </div>
            </footer>

            {/* Alert Dialogs Section for Tutor Services */}
            <AlertDialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <AlertDialogContent size="xl" className="w-[95vw] max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader className='text-left'>
                        <AlertDialogTitle className='flex justify-between items-center w-full'>
                            <h2 className="text-slate-700 text-xl font-bold uppercase">{selectedSubject?.subject || 'Subject'} Topics</h2>

                            <Button size='sm' onClick={() => setDetailsOpen(false)}>Close</Button>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 mt-2 text-left">
                                {/* Subject Description */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-1">Description</h4>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {selectedSubject?.description || 'No subject description available.'}
                                    </p>
                                </div>

                                {/* Topics */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-2">Topics</h4>

                                    {loadingTopics && (
                                        <p className="text-sm text-slate-600">Loading topics...</p>
                                    )}

                                    {!loadingTopics && topics.length === 0 && (
                                        <p className="text-sm text-slate-600">No topics found for this subject.</p>
                                    )}

                                    {!loadingTopics && topics.length > 0 && (
                                        <div className="space-y-3">
                                            {topics.map((topicItem) => (
                                                <div key={topicItem.id} className="rounded-md shadow border border-orange-300 bg-orange-50 p-3">
                                                    <p className="font-medium text-slate-900">{topicItem.topic}</p>

                                                    {topicItem.description && (
                                                        <p className="text-xs text-slate-700 mb-2 whitespace-pre-wrap">{topicItem.description}</p>
                                                    )}

                                                    {topicItem.difficulty && (
                                                        <Badge
                                                            className={`text-xs rounded-full
                                                                ${topicItem.difficulty.toLowerCase() === 'beginner' && ('bg-green-200 text-slate-700 border border-green-500')
                                                                }
                                                                ${topicItem.difficulty.toLowerCase() === 'intermediate' && ('bg-yellow-200 text-slate-700 border border-yellow-500')
                                                                }
                                                                ${topicItem.difficulty.toLowerCase() === 'advanced' && ('bg-cyan-200 text-slate-700 border border-cyan-500')
                                                                }
                                                            `}
                                                            variant="outline"
                                                        >
                                                            {topicItem.difficulty}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert Dialogs Section for Crash Courses*/}
            <AlertDialog open={courseDetailsOpen} onOpenChange={setCourseDetailsOpen}>
                <AlertDialogContent size="xl" className="w-[50vw] max-h-[80vh] text- overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className='flex justify-between items-center w-full'>
                            <h2 className="text-slate-700 text-xl font-bold uppercase">{viewSelectedCourse?.title || 'Crash Course'}</h2>

                            <Button size='sm' onClick={() => setCourseDetailsOpen(false)}>Close</Button>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild className="w-full text-left">
                            <div className="space-y-4">
                                {/* Subject Description */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-1">Course Details</h4>
                                    <div className="flex items-center gap-1 text-sm">
                                        <IoTimeOutline className='text-lg' />
                                        <p>{viewSelectedCourse?.hours} Hours ({viewSelectedCourse?.session} Sessions)</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <CiMoneyCheck1 className='text-lg' />
                                        <p>P{viewSelectedCourse?.price}</p>
                                    </div>
                                </div>

                                {/* Topics */}
                                <div>
                                    <h4 className="font-semibold text-slate-700 mb-2">Topics Included:</h4>

                                    {loadingCourseDetails && (
                                        <p className="text-sm text-slate-600">Loading topics...</p>
                                    )}

                                    {!loadingCourseDetails && (!viewSelectedCourse?.topics_included?.topics || viewSelectedCourse.topics_included.topics.length === 0) && (
                                        <p className="text-sm text-slate-600">No topics found for this course.</p>
                                    )}

                                    {!loadingCourseDetails && viewSelectedCourse?.topics_included?.topics?.length > 0 && (
                                        <div className="space-y-3">
                                            {viewSelectedCourse.topics_included.topics.map((topicItem, topicIndex) => (
                                                <div key={`${viewSelectedCourse.id}-${topicIndex}`} className="rounded-md shadow border border-orange-300 bg-orange-50 p-3">
                                                    <p className="font-medium text-slate-900">{topicItem}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
