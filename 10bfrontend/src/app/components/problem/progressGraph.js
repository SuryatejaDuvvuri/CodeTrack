"use client";
import {useEffect, useState} from 'react';
import {format} from 'date-fns'

export default function progressGraph({id})
{
    const [attemptData, setAttemptDat] = useState([
    { 
      timestamp: new Date('2023-07-16T04:31:25'), 
      success: false,
      duration: 32 // seconds
    },
    { 
      timestamp: new Date('2023-07-16T04:31:55'), 
      success: false,
      duration: 28
    },
    { 
      timestamp: new Date('2023-07-16T04:32:30'), 
      success: false,
      duration: 45
    },
    { 
      timestamp: new Date('2023-07-16T04:40:15'), 
      success: false,
      duration: 38
    },
    { 
      timestamp: new Date('2023-07-16T04:42:10'), 
      success: false,
      duration: 25
    },
    { 
      timestamp: new Date('2023-07-16T04:42:45'), 
      success: false,
      duration: 42
    },
    { 
      timestamp: new Date('2023-07-16T04:43:20'), 
      success: true,
      duration: 36
    },
    { 
      timestamp: new Date('2023-07-16T04:46:30'), 
      success: false,
      duration: 29
    },
    { 
      timestamp: new Date('2023-07-16T04:47:15'), 
      success: true,
      duration: 40
    },
    { 
      timestamp: new Date('2023-07-16T04:52:00'), 
      success: true,
      duration: 27
    },
    { 
      timestamp: new Date('2023-07-16T04:55:45'), 
      success: true,
      duration: 33
    },
    { 
      timestamp: new Date('2023-07-16T04:56:25'), 
      success: true,
      duration: 31
    },
    { 
      timestamp: new Date('2023-07-16T04:56:50'), 
      success: false,
      duration: 44
    },
    { 
      timestamp: new Date('2023-07-16T04:57:15'), 
      success: true,
      duration: 29
    }
  ]);

  return (
    <div className = "rounded-lg p-4">
        <div className = "flex justify-between items-center mb-3">
            <h3 className='text-lg'>Progress Graph</h3>
            <div className = "flex items-center space-x-2">
                <div className = "flex items-center">
                    <div className = "w-3 h-3 bg-red-500 mr-1"></div>
                    <div className = "text-xs">Failed</div>
                </div>
                <div className = "flex items-center">
                    <div className = "w-3 h-3 bg-green-500 mr-1"></div>
                    <div className = "text-xs">Passed</div>
                </div>
            </div>
        </div>
        <div className = "relative h-40">
            <div className = "absolute left-0 w-full flex justify-between text-xs">
                <div>{format(attemptData[0].timestamp, 'hh:mm:ss a')}</div>
                <div>{format(attemptData[Math.floor(attemptData.length/2)].timestamp, 'hh:mm:ss a')}</div>
                <div>{format(attemptData[attemptData.length-1].timestamp, 'hh:mm:ss a')}</div>
            </div>
            <div className = "absolute bottom-5 left-0 right-0 top-0 flex items-end justify-between">
                {attemptData.map((attempt,index) => (
                    <div key = {index} className = "relative mx-px" style={{ 
                        height: `${Math.min(90, Math.max(30, attempt.duration))}%`,
                        width: `${85 / attemptData.length}%` 
                    }}>
                        <div className = {`w-full absolute bottom-0 ${
                        attempt.success ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ height: '100%' }}></div>

                    </div>
                ))}
            </div>
            
            <div className = "absolute mx-auto bottom-0 left-0 w-full h-px px-4">
                <div className = "flex flex-wrap gap-3">
                    <div>
                        <div className = "text-gray-400">Success Rate</div>
                        <div className="text-xl font-semibold">{Math.round((attemptData.filter(a => a.success).length / attemptData.length) * 100)}%</div>
                    </div>
                    <div>
                        <div className = "text-gray-400">Total Attempts</div>
                        <div className = "text-xl font-semibold">{attemptData.length}</div>
                    </div>
                    <div>
                        <div className = "text-gray-400">Average Time Spent</div>
                        <div className="text-xl font-semibold">
                            {Math.round(attemptData.reduce((sum, a) => sum + a.duration, 0) / attemptData.length)}s
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}