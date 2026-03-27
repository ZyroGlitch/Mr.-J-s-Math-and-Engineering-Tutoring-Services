import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FaArrowRightLong } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays } from "lucide-react"
import supabase from '@/supabase-client'
import { toast } from "sonner"
import { MdAccessTimeFilled } from 'react-icons/md'
import { GoArrowRight } from "react-icons/go";
import { PiNotePencil } from "react-icons/pi";

export default function EditBooking() {
    const navigate = useNavigate();
    // --------------------------------------------------------------------------------

    // Get the passed bookingId from Booking.jsx
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    // alert(`Received bookingId: ${bookingId}`);

    // --------------------------------------------------------------------------------

    // Data state for the booking details form
    const [date, setDate] = useState(new Date())
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [calendarMonth, setCalendarMonth] = useState(new Date())

    const [data, setData] = useState(
        {
            studentName: '',
            parentName: '',
            contactNumber: '',
            email: '',
            subject: '',
            startDate: new Date(),
            time: '',
            additionalInfo: ''
        },
    );

    // --------------------------------------------------------------------------------
    const [bookingDetails, setBookingDetails] = useState([]);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchBookingDetails(bookingId);
    }, [])

    const fetchBookingDetails = async (bookingId) => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error) {
            console.error('Error fetching booking details:', error);
            toast.error("Failed to fetch booking details. Please try again.");
        } else {
            // console.log('Fetched booking details:', data);
            const fetchedStartDate = data?.start_date ? new Date(data.start_date) : new Date();

            setData({
                studentName: data?.student_name ?? '',
                parentName: data?.parent_name ?? '',
                contactNumber: data?.contact_number ?? '',
                email: data?.email ?? '',
                subject: data?.subject ?? '',
                startDate: fetchedStartDate,
                time: data?.time ?? '',
                additionalInfo: data?.message ?? ''
            });
            setDate(fetchedStartDate);
            setCalendarMonth(fetchedStartDate);

            setBookingDetails(data);
            setNewStatus(data?.booking_status ?? ''); // Set the initial value of newStatus to the current booking status
        }
    }

    // --------------------------------------------------------------------------------

    const fileSubmit = async (e) => {
        e.preventDefault();
        // console.log('data from form:', data);

        const { data: updatedBooking, error } = await supabase
            .from('booking_tbl')
            .update({
                student_name: data.studentName,
                parent_name: data.parentName,
                contact_number: data.contactNumber,
                email: data.email,
                subject: data.subject,
                start_date: data.startDate,
                time: data.time,
                message: data.additionalInfo,
                booking_status: newStatus || bookingDetails.booking_status
            })
            .eq('id', bookingId)
            .select('*')
            .single();

        if (error) {
            // console.error('Error updating data into booking_tbl:', error);
            toast.error("Failed to update session. Please try again.");
        } else {
            // console.log('Data updated into booking_tbl successfully!');
            console.log('Updated booking:', updatedBooking);
            toast.success("Session updated successfully!");
            resetForm();

            navigate('/admin-booking'); // Redirect to the booking overview page after successful update
        }
    }

    const resetForm = () => {
        const resetDate = new Date();
        setDate(resetDate);
        setCalendarMonth(resetDate);
        setIsCalendarOpen(false);
        setData({
            studentName: '',
            parentName: '',
            contactNumber: '',
            email: '',
            subject: '',
            startDate: resetDate,
            time: '',
            additionalInfo: ''
        });
        setNewStatus(''); // Reset the newStatus to an empty string
    }

    // --------------------------------------------------------------------------------

    return (
        <>
            <section className="min-h-screen rounded-lg border border-slate-500/25 p-8">
                <Breadcrumb className='mb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link to='/admin-booking' />}>
                                Booking
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-slate-700'>Edit Booking</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <form onSubmit={fileSubmit}>
                    <h5 className="text-md text-blue-400 font-semibold border-b border-gray-400 text-left flex items-center pb-2 mb-4">
                        <IoPersonSharp className="inline-block mr-2" />
                        <span>Personal Information</span>
                    </h5>
                    <div className='grid md:grid-cols-2 gap-4 mb-8'>
                        <div className="min-h-fit">
                            <Label htmlFor="name" className='text-xs mb-2'>Student Name</Label>
                            <Input
                                type="text"
                                id='name'
                                placeholder='Enter student name'
                                className='w-full rounded-md border border-slate-500/50 focus-visible:border-blue-500 focus-visible:ring-0'
                                required
                                value={data.studentName}
                                onChange={(e) => setData({ ...data, studentName: e.target.value })}
                            />
                        </div>

                        <div className="min-h-fit">
                            <Label htmlFor="parentName" className='text-xs mb-2'>Parents Name</Label>
                            <Input
                                type="text"
                                id='parentName'
                                placeholder='Enter parent name'
                                className='w-full rounded-md border border-slate-500/50 focus-visible:border-blue-500 focus-visible:ring-0'
                                required
                                value={data.parentName}
                                onChange={(e) => setData({ ...data, parentName: e.target.value })}
                            />
                        </div>

                        <div className="min-h-fit">
                            <Label htmlFor="contact" className='text-xs mb-2'>Contact Number</Label>
                            <Input
                                type="text"
                                id='contact'
                                placeholder='Enter contact number'
                                className='w-full rounded-md border border-slate-500/50 focus-visible:border-blue-500 focus-visible:ring-0'
                                required
                                value={data.contactNumber}
                                onChange={(e) => setData({ ...data, contactNumber: e.target.value })}
                            />
                        </div>

                        <div className="min-h-fit">
                            <Label htmlFor="email" className='text-xs mb-2'>Email (optional)</Label>
                            <Input
                                type="email"
                                id='email'
                                placeholder='Enter email address'
                                className='w-full rounded-md border border-slate-500/50 focus-visible:border-blue-500 focus-visible:ring-0'
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <h5 className="text-md text-blue-400 font-semibold border-b border-gray-400 text-left flex items-center pb-2 mb-4">
                        <IoPersonSharp className="inline-block mr-2" />
                        <span>Subject Information</span>
                    </h5>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="min-h-fit">
                            <Label htmlFor="subject" className='text-xs mb-2'>Subject</Label>
                            <Select value={data.subject} onValueChange={(value) => setData({ ...data, subject: value })}>
                                <SelectTrigger className="w-full max-w-full rounded-md border border-slate-500/50">
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Subjects</SelectLabel>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Math">Math</SelectItem>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="History">History</SelectItem>
                                        <SelectItem value="Geography">Geography</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="min-h-fit">
                            <Label htmlFor="subject" className='text-xs mb-2'>When do you want to start?</Label>
                            <div className="relative">
                                <Button
                                    type="button"

                                    onClick={() =>
                                        setIsCalendarOpen((open) => {
                                            if (!open && date) {
                                                setCalendarMonth(date)
                                            }
                                            return !open
                                        })
                                    }
                                    className="w-full h-[36px] justify-start rounded-md border border-slate-500/50 text-left text-slate-700 bg-transparent hover:bg-transparent font-normal"
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {date ? date.toLocaleDateString() : "Pick a date"}
                                </Button>

                                {isCalendarOpen && (
                                    <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[368px] rounded-xl bg-white p-3 shadow-lg">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            month={calendarMonth}
                                            onMonthChange={setCalendarMonth}
                                            onSelect={(selectedDate) => {
                                                if (selectedDate) {
                                                    setDate(selectedDate)
                                                    setCalendarMonth(selectedDate)
                                                    setData({ ...data, startDate: selectedDate })
                                                }
                                                setIsCalendarOpen(false)
                                            }}
                                            className="w-full rounded-xl border-0 p-2 [--cell-size:3.25rem]"
                                            classNames={{
                                                table: "w-full border-separate border-spacing-2",
                                                week: "mt-1 flex w-full gap-2",
                                                weekday: "flex-1 rounded-md py-2.5 text-sm font-medium text-muted-foreground",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="min-h-fit">
                            <Label htmlFor="subject" className='text-xs mb-2'>What time works best for you?</Label>
                            <Select value={data.time} onValueChange={(value) => setData({ ...data, time: value })}>
                                <SelectTrigger className="w-full max-w-full rounded-md border border-slate-500/50">
                                    <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Morning</SelectLabel>
                                        <SelectItem value="8-9 AM">8:00 AM - 9:00 AM</SelectItem>
                                        <SelectItem value="9-10 AM">9:00 AM - 10:00 AM</SelectItem>
                                        <SelectItem value="10-11 AM">10:00 AM - 11:00 AM</SelectItem>
                                        <SelectItem value="11-12 AM">11:00 AM - 12:00 AM</SelectItem>

                                        <SelectLabel>Afternoon</SelectLabel>
                                        <SelectItem value="1-2 PM">1:00 PM - 2:00 PM</SelectItem>
                                        <SelectItem value="2-3 PM">2:00 PM - 3:00 PM</SelectItem>
                                        <SelectItem value="3-4 PM">3:00 PM - 4:00 PM</SelectItem>
                                        <SelectItem value="4-5 PM">4:00 PM - 5:00 PM</SelectItem>

                                        <SelectLabel>Evening</SelectLabel>
                                        <SelectItem value="5-6 PM">5:00 PM - 6:00 PM</SelectItem>
                                        <SelectItem value="6-7 PM">6:00 PM - 7:00 PM</SelectItem>
                                        <SelectItem value="7-8 PM">7:00 PM - 8:00 PM</SelectItem>
                                        <SelectItem value="8-9 PM">8:00 PM - 9:00 PM</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Textarea
                        placeholder="Additional information or questions"
                        className='w-full h-[150px] rounded-md border border-slate-500/50 focus-visible:border-blue-500 focus-visible:ring-0 mb-4'
                        value={data.additionalInfo}
                        onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
                    />

                    <div>
                        <p className="text-md text-blue-400 font-semibold border-b border-gray-400 text-left flex items-center gap-2 pb-2 mb-4">
                            <MdAccessTimeFilled size={20} />
                            <span>Booking Status</span>
                        </p>
                        <div className="grid grid-cols-2 mb-8">
                            <div className="min-h-fit">
                                <p className="text-sm text-gray-500 font-semibold mb-2 text-left">Status</p>

                                <div className="flex items-center gap-2">
                                    {
                                        bookingDetails?.booking_status === 'Requested' && (
                                            <>
                                                <p className="text-sm bg-slate-200 rounded-full px-2 py-1 shadow w-fit">
                                                    {bookingDetails?.booking_status ?? 'None'}
                                                </p>
                                                <GoArrowRight />
                                                <p className="text-sm bg-yellow-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">Pending</p>
                                            </>
                                        )
                                    }
                                    {
                                        bookingDetails?.booking_status === 'Pending' && (
                                            <>
                                                <p className="text-sm bg-yellow-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">
                                                    {bookingDetails?.booking_status ?? 'None'}
                                                </p>
                                                <GoArrowRight />
                                                <p className="text-sm bg-blue-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">Confirmed</p>
                                            </>
                                        )
                                    }
                                    {
                                        bookingDetails?.booking_status === 'Confirmed' && (
                                            <>
                                                <p className="text-sm bg-blue-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">
                                                    {bookingDetails?.booking_status ?? 'None'}
                                                </p>
                                                <GoArrowRight />
                                                <p className="text-sm bg-green-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">Completed</p>
                                            </>
                                        )
                                    }
                                    {
                                        bookingDetails?.booking_status === 'Completed' && (
                                            <>
                                                <p className="text-sm bg-green-200 text-slate-800 rounded-full px-2 py-1 shadow w-fit">Completed</p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>

                            {
                                bookingDetails?.booking_status === 'Completed' ? null
                                    : (
                                        <div className="min-h-fit">
                                            <p className="text-sm text-gray-500 font-semibold text-left mb-2">Update the booking status</p>
                                            <Select
                                                value={newStatus}
                                                onValueChange={(value) => setNewStatus(value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="Requested">Requested</SelectItem>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )
                            }
                        </div>
                    </div>

                    <div className="flex">
                        <Button type='submit' className='bg-blue-500 text-white text-sm rounded-md shadow w-fit px-4 py-2 hover:bg-blue-600'>
                            <PiNotePencil className='inline-block mr-2' />
                            <span>Update Booking Information</span>
                        </Button>
                    </div>
                </form>
            </section>
        </>
    )
}

