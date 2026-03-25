import React, { useEffect, useState } from 'react'
import { Grid } from "gridjs-react";
import { h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";
import { LuCalendarCheck2, LuUserRoundCheck, LuPlus } from 'react-icons/lu';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { FiBookOpen } from 'react-icons/fi';
import { TbMessage2Star } from 'react-icons/tb';
import supabase from '@/supabase-client';
import { AiOutlineForm } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { MdOutlineAssignment } from "react-icons/md";
import { SlCheck } from "react-icons/sl";
import { Button } from '@/components/ui/button';

export default function Booking() {
    const [bookingData, setBookingData] = useState([]);

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
    ];

    const dataColumns = gridFieldOrder.map((field) => ({
        name: field.label,
        sort: true,
        width: '200px',
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
            : {})
    }));

    const onView = (recordId) => {
        console.log('View record id:', recordId);
    };

    const onEdit = (recordId) => {
        console.log('Edit record id:', recordId);
    };

    const onDelete = (recordId) => {
        console.log('Delete record id:', recordId);
    };

    const onAddBooking = () => {
        console.log('Add new booking');
    };

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
        const date = new Date(value);

        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        return `${formattedDate}`;
    };

    const gridColumns = [
        {
            name: 'Actions',
            sort: false,
            width: '160px',
            formatter: (recordId) =>
                h(
                    'div',
                    { className: 'flex items-center justify-center gap-1' },
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'View',
                            'data-record-id': String(recordId ?? ''),
                            onClick: () => onView(recordId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded border border-slate-300 text-xs hover:bg-slate-100'
                        },
                        '👁'
                    ),
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'Edit',
                            'data-record-id': String(recordId ?? ''),
                            onClick: () => onEdit(recordId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded border border-slate-300 text-xs hover:bg-slate-100'
                        },
                        '✏️'
                    ),
                    h(
                        'button',
                        {
                            type: 'button',
                            title: 'Delete',
                            'data-record-id': String(recordId ?? ''),
                            onClick: () => onDelete(recordId),
                            className: 'w-7 h-7 inline-flex items-center justify-center rounded border border-slate-300 text-xs hover:bg-slate-100'
                        },
                        '🗑️'
                    )
                )
        },
        ...dataColumns
    ];

    const gridRows = bookingData.map((item) => [
        item.id ?? item.booking_id ?? '',
        ...gridFieldOrder.map((field) => {
            if (field.key === 'created_at') {
                return formatCreatedAt(item[field.key]);
            }

            if (field.key === 'start_date') {
                return formatStart_date(item[field.key]);
            }

            return item[field.key] ?? '-';
        })
    ]);

    useEffect(() => {
        fetchBookingData();
    }, []);

    const fetchBookingData = async () => {
        const { data, error } = await supabase
            .from('booking_tbl')
            .select('*');

        if (data) {
            console.log('Booking data:', data);
            setBookingData(data);
        } else {
            console.log('Error fetching booking data:', error);
        }
    }

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="min-h-fit flex flex-col border border-slate-500/25 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                            <p className="text-sm text-gray-500 font-semibold">Booking Requests</p>
                            <p className="text-xl font-semibold">1,234</p>
                        </div>
                        <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                            <AiOutlineForm size={20} />
                        </div>
                    </div>

                    <p className="text-xs flex items-center gap-2 text-green-500">
                        <span className='font-semibold'>
                            <FaArrowTrendUp className='inline-block' /> 12%
                        </span>
                        <span className="text-xs text-gray-500 ">from last month</span>
                    </p>
                </div>

                <div className="min-h-fit flex flex-col border border-slate-500/25 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                            <p className="text-sm text-gray-500 font-semibold">Pending Bookings</p>
                            <p className="text-xl font-semibold">1,234</p>
                        </div>
                        <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                            <IoMdTime size={20} />
                        </div>
                    </div>

                    <p className="text-xs flex items-center gap-2 text-green-500">
                        <span className='font-semibold'>
                            <FaArrowTrendUp className='inline-block' /> 12%
                        </span>
                        <span className="text-xs text-gray-500 ">from last month</span>
                    </p>
                </div>

                <div className="min-h-fit flex flex-col border border-slate-500/25 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                            <p className="text-sm text-gray-500 font-semibold">Confirmed Sessions</p>
                            <p className="text-xl font-semibold">1,234</p>
                        </div>
                        <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                            <MdOutlineAssignment size={20} />
                        </div>
                    </div>

                    <p className="text-xs flex items-center gap-2 text-green-500">
                        <span className='font-semibold'>
                            <FaArrowTrendUp className='inline-block' /> 12%
                        </span>
                        <span className="text-xs text-gray-500 ">from last month</span>
                    </p>
                </div>

                <div className="min-h-fit flex flex-col border border-slate-500/25 shadow-sm rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                            <p className="text-sm text-gray-500 font-semibold">Completed Sessions</p>
                            <p className="text-xl font-semibold">1,234</p>
                        </div>
                        <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                            <SlCheck size={20} />
                        </div>
                    </div>

                    <p className="text-xs flex items-center gap-2 text-green-500">
                        <span className='font-semibold'>
                            <FaArrowTrendUp className='inline-block' /> 12%
                        </span>
                        <span className="text-xs text-gray-500 ">from last month</span>
                    </p>
                </div>
            </div>

            <div className="w-full bg-white border border-slate-500/25 rounded-lg p-4">
                <div className="w-full overflow-x-auto text-sm relative">
                    <Button size='sm' className="absolute top-1 right-0 z-10 text-xs bg-blue-500 hover:bg-blue-600">
                        <LuPlus className='inline-block mr-1' /> Add Booking
                    </Button>

                    <Grid
                        data={gridRows}
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
        </>
    )
}
