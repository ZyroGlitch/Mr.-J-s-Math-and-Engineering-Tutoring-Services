import React, { useEffect, useState } from 'react'
import { Grid } from "gridjs-react";
import { h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";
import { LuPlus } from 'react-icons/lu';
import { FaArrowTrendUp } from 'react-icons/fa6';
import supabase from '@/supabase-client';
import { AiOutlineForm } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { MdOutlineAssignment } from "react-icons/md";
import { SlCheck } from "react-icons/sl";
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IoPersonSharp } from "react-icons/io5";
import { IoBook } from "react-icons/io5";
import { MdAccessTimeFilled } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoWarningOutline } from "react-icons/io5";
import { toast } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PiNotePencil } from "react-icons/pi";

export default function Request() {
    const navigate = useNavigate();

    // --------------------------------------------------------------------------------

    // This is for GridJS Data Table and Configurations
    const [bookingData, setBookingData] = useState([]);
    const [bookingRequests, setBookingRequests] = useState({
        requested: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
    });

    const gridFieldOrder = [
        { key: 'start_date', label: 'Start Date' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
        { key: 'time', label: 'Time' },
        { key: 'student_name', label: 'Student Name' },
        { key: 'parent_name', label: 'Parent Name' },
        { key: 'contact_number', label: 'Contact Number' },
        { key: 'email', label: 'Email' },
        { key: 'created_at', label: 'Created At' },
        { key: 'booking_status', label: 'Booking Status' },
    ];

    const dataColumns = gridFieldOrder.map((field) => ({
        id: field.key,
        name: field.label,
        sort: true,
        width: '200px',
        data: (row) => {
            const value = row?.[field.key];

            if (field.key === 'created_at') {
                return formatCreatedAt(value);
            }

            if (field.key === 'start_date') {
                return formatStart_date(value);
            }

            return value ?? '-';
        },
        ...(field.key === 'message'
            ? {
                formatter: (cell) =>
                    h(
                        'div',
                        {
                            style: {
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere'
                            }
                        },
                        cell ?? '-'
                    )
            }
            : field.key === 'booking_status'
                ? {
                    formatter: (cell) =>
                        h(
                            'span',
                            {
                                className: `px-3 py-1 rounded-full text-xs font-semibold ${getStatusButtonColor(cell)}`
                            },
                            cell ?? '-'
                        )
                }
                : {})
    }));

    const formatCreatedAt = (value) => {
        if (!value) return '-';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        return `${formattedDate} - ${formattedTime}`;
    };

    const formatStart_date = (value) => {
        if (!value) return '-';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        return `${formattedDate}`;
    };

    const getStatusButtonColor = (status) => {
        const statusLower = String(status).toLowerCase();
        switch (statusLower) {
            case 'requested':
                return 'bg-gray-200 text-gray-800';
            case 'pending':
                return 'bg-orange-200 text-orange-800';
            case 'confirmed':
                return 'bg-cyan-200 text-cyan-800';
            case 'completed':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const gridColumns = [
        {
            id: 'actions',
            name: 'Actions',
            sort: false,
            width: '160px',
            data: (row) => row?.id ?? row?.booking_id ?? '',
            formatter: (bookingId) =>
                h(
                    'div',
                    { className: 'flex items-center justify-center gap-1' },
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'View Record',
                            'data-record-id': String(bookingId ?? ''),
                            onClick: () => onView(bookingId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded shadow-sm bg-blue-500 text-xs hover:bg-blue-600'
                        },
                        h(
                            'svg',
                            {
                                xmlns: 'http://www.w3.org/2000/svg',
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '8',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                className: 'text-white'
                            },
                            h('path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }),
                            h('circle', { cx: '12', cy: '12', r: '3' })
                        )
                    ),
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'Edit Record',
                            'data-record-id': String(bookingId ?? ''),
                            onClick: () => onEdit(bookingId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded shadow-sm bg-yellow-300 text-xs hover:bg-yellow-400'
                        },
                        h(
                            'svg',
                            {
                                xmlns: 'http://www.w3.org/2000/svg',
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '8',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                className: 'text-black'
                            },
                            h('path', { d: 'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
                            h('path', { d: 'M18.375 2.625a1.5 1.5 0 1 1 3 3L12 15l-4 1 1-4Z' })
                        )
                    ),
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'Delete Record',
                            'data-record-id': String(bookingId ?? ''),
                            onClick: () => onDelete(bookingId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded shadow-sm bg-red-400 text-xs hover:bg-red-500'
                        },
                        h(
                            'svg',
                            {
                                xmlns: 'http://www.w3.org/2000/svg',
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '8',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                className: 'text-white'
                            },
                            h('path', { d: 'M3 6h18' }),
                            h('path', { d: 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2' }),
                            h('path', { d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
                            h('path', { d: 'M10 11v6' }),
                            h('path', { d: 'M14 11v6' })
                        )
                    )
                )
        },
        ...dataColumns
    ];

    // Action Handlers for View, Edit, and Delete buttons in the Actions column of the GridJS table
    const onView = (bookingId) => {
        // console.log('View record id:', bookingId);
        handleViewBooking(bookingId);
    };

    const onEdit = (bookingId) => {
        // console.log('Edit record id:', bookingId);
        navigate(`/admin-edit-booking?bookingId=${bookingId}`);
    };

    const onDelete = (bookingId) => {
        console.log('Delete record id:', bookingId);
        setDeleteMessageOpen(true);
        setDeleteId(bookingId); // store the bookingId to be deleted when user confirms deletion
    };

    // --------------------------------------------------------------------------------

    // Fetch booking data and counts for different booking statuses when component mounts
    useEffect(() => {
        fetchBookingData();
        totalBookingRequests();
        totalBookingPendings();
        totalBookingConfirmed();
        totalBookingCompleted();
    }, []);

    // Fetch Booking Data
    const fetchBookingData = async () => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .select('*')
            .eq('booking_status', 'Requested')
            .order('updated_at', { ascending: false });

        if (data) {
            // console.log('Booking data:', data);
            setBookingData(data);
        } else {
            console.log('Error fetching booking data:', error);
        }
    }

    // Total Count of Different Bookings Status
    const totalBookingRequests = async () => {
        const { count, error } = await supabase
            .from('booking_tbl')
            .select('id', { count: 'exact' })
            .eq('booking_status', 'Requested');

        if (error) {
            console.log('Error fetching total booking requests:', error);
        } else {
            setBookingRequests((prev) => ({ ...prev, requested: count }));
        }
    }

    // Total Count of Pending Bookings
    const totalBookingPendings = async () => {
        const { count, error } = await supabase
            .from('booking_tbl')
            .select('id', { count: 'exact' })
            .eq('booking_status', 'Pending');

        if (error) {
            console.log('Error fetching total booking pendings:', error);
        } else {
            setBookingRequests((prev) => ({ ...prev, pending: count }));
        }
    }

    // Total Count of Confirmed Bookings
    const totalBookingConfirmed = async () => {
        const { count, error } = await supabase
            .from('booking_tbl')
            .select('id', { count: 'exact' })
            .eq('booking_status', 'Confirmed');

        if (error) {
            console.log('Error fetching total booking confirmed:', error);
        } else {
            setBookingRequests((prev) => ({ ...prev, confirmed: count }));
        }
    }

    // Total Count of Completed Bookings
    const totalBookingCompleted = async () => {
        const { count, error } = await supabase
            .from('booking_tbl')
            .select('id', { count: 'exact' })
            .eq('booking_status', 'Completed');

        if (error) {
            console.log('Error fetching total booking completed:', error);
        } else {
            setBookingRequests((prev) => ({ ...prev, completed: count }));
        }
    }

    // --------------------------------------------------------------------------------

    // View Record in Booking
    const [viewRecordDialog, setViewRecordDialog] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);

    const viewBookingDetails = async (bookingId) => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .select('*')
            .eq('id', bookingId);

        if (error) {
            console.error('Error fetching booking details:', error);
            setBookingDetails(null);
        } else {
            setBookingDetails(data?.[0] ?? null);
            console.log('Fetched booking details:', data);
        }
    };

    const handleViewBooking = async (bookingId) => {
        setViewRecordDialog(true); // Trigger the booking details dialog
        await viewBookingDetails(bookingId);
    };

    // Update Status Record in View Booking
    const [newStatus, setNewStatus] = useState('');

    const updateRecord = async (bookingId, newStatus) => {
        if (!bookingId || !newStatus) {
            console.warn('Missing bookingId or newStatus for update.');
            return;
        }

        const { data, error } = await supabase
            .from('booking_tbl')
            .update({ 'booking_status': newStatus })
            .eq('id', bookingId)
            .select('id, booking_status')
            .single();

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated:', data);
            setViewRecordDialog(false); // Close the dialog after successful update
            setNewStatus(data?.booking_status ?? '');

            setBookingDetails((prev) => (prev ? { ...prev, booking_status: data?.booking_status ?? newStatus } : prev));

            await fetchBookingData();
            await totalBookingRequests();
            await totalBookingPendings();
            await totalBookingConfirmed();
            await totalBookingCompleted();
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        // console.log('Updating booking id', bookingId, '- to new status:', newStatus);
        await updateRecord(bookingId, newStatus);
    }

    // --------------------------------------------------------------------------------
    const [deleteMessageOpen, setDeleteMessageOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Delete a specific booking record
    const deleteRecord = async (bookingId) => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .delete()
            .eq('id', bookingId);

        if (error) {
            console.error('Error deleting data:', error);
        } else {
            navigate('/admin-request-booking'); // Redirect to the booking overview page after deletion

            toast('Booking deleted successfully!', { type: 'success' });

            // Update the booking data and counts after deletion
            await fetchBookingData();
            await totalBookingRequests();
            await totalBookingPendings();
            await totalBookingConfirmed();
            await totalBookingCompleted();
        }
    };

    const handleDeleteBooking = async () => {
        if (!deleteId) return;
        await deleteRecord(deleteId);
        setDeleteId(null);
    };

    // --------------------------------------------------------------------------------

    return (
        <>
            {/* Grid Data Table Section */}
            <div className="w-full bg-white border border-slate-500/25 rounded-lg p-4">
                {/* Booking Status Dashboard */}
                <Breadcrumb className='mb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link to='/admin-booking' />}>
                                Booking
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-slate-700'>Requested Booking</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-full overflow-x-auto text-sm relative">
                    <Link to='/admin-add-booking'>
                        <Button size='sm' className="absolute top-1 right-0 z-10 text-xs bg-blue-500 hover:bg-blue-600">
                            <LuPlus className='inline-block mr-1' /> Add Booking
                        </Button>
                    </Link>


                    <Grid
                        data={bookingData}
                        columns={gridColumns}
                        style={{
                            table: {
                                width: '100%',
                                'table-layout': 'fixed'
                            },
                            th: {
                                'white-space': 'nowrap'
                            },
                            td: {
                                'white-space': 'normal',
                                'word-break': 'break-word',
                                'overflow-wrap': 'anywhere',
                            }
                        }}

                        search={true}
                        sort={true}
                        pagination={{
                            enabled: true,
                            limit: 10
                        }}
                    />
                </div>
            </div>

            {/* Alert Dialogs Section for View Booking Record */}
            <AlertDialog open={viewRecordDialog} onOpenChange={setViewRecordDialog}>
                <AlertDialogContent size="xl" className="w-[50vw] max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className='flex justify-between items-center w-full'>
                            <h2 className="text-slate-700 text-xl font-bold uppercase">Booking Details</h2>
                            <Button size='sm' onClick={() => setViewRecordDialog(false)}>Close</Button>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild className="w-full text-left">
                            <div className="mb-4">
                                <p className="text-base font-semibold text-blue-400 pb-1 border-b border-slate-700/25 flex items-center gap-1 mb-2">
                                    <IoPersonSharp size={20} />
                                    <span>General Information</span>
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Student Name</p>
                                        <p className="text-sm">{bookingDetails?.student_name ?? 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Parent Name</p>
                                        <p className="text-sm">{bookingDetails?.parent_name ?? 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Contact Number</p>
                                        <p className="text-sm">{bookingDetails?.contact_number ?? 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Email Address</p>
                                        <p className="text-sm">
                                            {bookingDetails?.email && bookingDetails.email.trim() !== '' ? bookingDetails.email : 'None'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-base font-semibold text-blue-400 pb-1 border-b border-slate-700/25 flex items-center gap-1 mb-2">
                                    <IoBook size={20} />
                                    <span>Booking Information</span>
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Subject Enrolled</p>
                                        <p className="text-sm">{bookingDetails?.subject ?? 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Preferred Time</p>
                                        <p className="text-sm">{bookingDetails?.time ?? 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Date Want to Start</p>
                                        <p className="text-sm">{bookingDetails?.start_date ? formatStart_date(bookingDetails.start_date) : 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Booked Date</p>
                                        <p className="text-sm">{bookingDetails?.created_at ? formatCreatedAt(bookingDetails.created_at) : 'None'}</p>
                                    </div>
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold">Message</p>
                                        <p className="text-sm">
                                            {bookingDetails?.message && bookingDetails.message.trim() !== '' ? bookingDetails.message : 'None'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-base font-semibold text-blue-400 pb-1 border-b border-slate-700/25 flex items-center gap-1 mb-2">
                                    <MdAccessTimeFilled size={20} />
                                    <span>Booking Status</span>
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="min-h-fit">
                                        <p className="text-sm text-gray-500 font-semibold mb-2">Status</p>

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
                                                    <p className="text-sm text-gray-500 font-semibold mb-2">Update the booking status</p>
                                                    <Select
                                                        value={newStatus}
                                                        onValueChange={(value) => setNewStatus(value)}
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                bookingDetails?.booking_status === 'Requested' && (
                                                                    <>
                                                                        <SelectGroup>
                                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                                            <SelectItem value="Completed">Completed</SelectItem>
                                                                        </SelectGroup>
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                bookingDetails?.booking_status === 'Pending' && (
                                                                    <>
                                                                        <SelectGroup>
                                                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                                            <SelectItem value="Completed">Completed</SelectItem>
                                                                        </SelectGroup>
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                bookingDetails?.booking_status === 'Confirmed' && (
                                                                    <>
                                                                        <SelectGroup>
                                                                            <SelectItem value="Completed">Completed</SelectItem>
                                                                        </SelectGroup>
                                                                    </>
                                                                )
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )
                                    }
                                </div>

                                <Button
                                    size='sm'
                                    className="mt-2 bg-blue-500 flex items-center gap-1 hover:bg-blue-600"
                                    onClick={
                                        () => handleUpdateStatus(bookingDetails?.id, newStatus)
                                    }
                                >
                                    <PiNotePencil />
                                    <span>Update Status</span>
                                </Button>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert Dialogs for Delete Confirmation */}
            <AlertDialog open={deleteMessageOpen} onOpenChange={setDeleteMessageOpen}>
                <AlertDialogContent size="xl" className="w-[26vw] max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className='flex justify-center items-center w-full'>
                            <div className="bg-red-100 text-red-500 rounded-lg flex justify-center items-center p-2">
                                <IoWarningOutline size={42} />
                            </div>
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild className="w-full text-center">
                            <p className="text-sm mb-4">Are you sure you want to delete this booking record?</p>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    size='sm'
                                    className='bg-slate-500 hover:bg-slate-600'
                                    onClick={() => setDeleteMessageOpen(false)}
                                >
                                    No, keep it.
                                </Button>
                                <Button
                                    size='sm'
                                    className='bg-red-500 hover:bg-red-600'
                                    onClick={async () => {
                                        setDeleteMessageOpen(false);
                                        await handleDeleteBooking();
                                    }}
                                >
                                    Yes, Delete!
                                </Button>
                            </div>

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
