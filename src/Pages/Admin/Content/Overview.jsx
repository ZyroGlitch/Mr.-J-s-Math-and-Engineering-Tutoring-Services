import React from 'react'
import { LuCalendarCheck2 } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { LuUserRoundCheck } from "react-icons/lu";
import { FiBookOpen } from "react-icons/fi";
import { TbMessage2Star } from "react-icons/tb";
import { Chart, Title, XAxis, YAxis, Tooltip, Legend, PlotOptions } from '@highcharts/react';
import { AreaSplineSeries } from '@highcharts/react/series/AreaSpline';

export default function Overview() {
    const bookingTrendData = [110, 145, 132, 168, 190, 176, 214, 240, 225, 260, 278, 301];
    const bookingMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <>
            {/* Use flex-grow when you allow to overflow the content */}
            <section className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="min-h-fit flex flex-col border border-slate-500/25 shadow-sm rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <p className="text-sm text-gray-500 font-semibold">Total Bookings</p>
                                <p className="text-xl font-semibold">1,234</p>
                            </div>
                            <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                                <LuCalendarCheck2 size={20} />
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
                                <p className="text-sm text-gray-500 font-semibold">Total Completed</p>
                                <p className="text-xl font-semibold">1,234</p>
                            </div>
                            <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                                <LuUserRoundCheck size={20} />
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
                                <p className="text-sm text-gray-500 font-semibold">Total Services</p>
                                <p className="text-xl font-semibold">1,234</p>
                            </div>
                            <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                                <FiBookOpen size={20} />
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
                                <p className="text-sm text-gray-500 font-semibold">Total Reviews</p>
                                <p className="text-xl font-semibold">1,234</p>
                            </div>
                            <div className="h-fit bg-blue-100 text-blue-500 rounded-lg p-3">
                                <TbMessage2Star size={20} />
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

                {/* HiChart Dashboard Here */}
                <div className="w-full flex-1 min-h-auto border border-slate-500/25 shadow-sm rounded-lg p-4 flex flex-col">
                    <p className="text-lg font-semibold text-left mb-4">Monthly Bookings Overview</p>
                    <Chart
                        containerProps={{
                            style: { width: '100%', height: '100%', flex: '1 1 auto' }
                        }}
                    >
                        <XAxis categories={bookingMonths} />
                        <YAxis>
                            <Title>Bookings</Title>
                        </YAxis>
                        <Tooltip valueSuffix=" bookings" />
                        <Legend enabled={false} />
                        <PlotOptions
                            areaspline={{
                                fillOpacity: 0.2,
                                marker: {
                                    enabled: false
                                }
                            }}
                        />
                        <AreaSplineSeries
                            data={bookingTrendData}
                            options={{
                                name: 'Bookings'
                            }}
                        />
                    </Chart>
                </div>
            </section>
        </>
    )
}
