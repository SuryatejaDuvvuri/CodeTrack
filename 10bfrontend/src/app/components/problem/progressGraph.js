"use client";
import {useEffect, useState, useRef} from 'react';
import {format} from 'date-fns'

function AnimatedBar({success, successRate}) 
{
  const ref = useRef(null);

  useEffect(() => 
  {
    if (ref.current) 
    {
      ref.current.style.height = '0px';
      setTimeout(() => {
        const height = success ? 250 : 64 + Math.max(successRate * 1.6, 32);
        ref.current.style.height = `${height}px`;
      }, 100);
    }
  }, [success, successRate]);

  const getBarColor = (successRate) => {
    if (successRate === 100) return "#22c55e";
    if (successRate >= 60) return "#eab308";
    return "#ef4444";
  };

  return (
    <div
      ref={ref}
      className="rounded"
      style={{
        width: '48px',
        height: `0px`,
        background: getBarColor(successRate),
        border: '2px solid white',
        transition: 'height 0.8s cubic-bezier(.17,.67,.83,.67)'
      }}
    />
  );
}

export default function progressGraph({attemptData = [],totalAttempts,avgTime,overrallSuccess, barClick})
{
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg relative">
      <div className="absolute right-6 top-6 flex items-end space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <div className="text-xs text-gray-300">Failed</div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <div className="text-xs text-gray-300">Passed</div>
        </div>
      </div>
      {attemptData.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center text-gray-200">
          <div className="text-lg mb-2">No attempts yet</div>
          <div className="text-sm">Run your code to see progress here!</div>
        </div>
      ) : (
        <div className="relative h-64">
          <div className="absolute left-0 right-0 flex items-end justify-start w-full h-full pb-2 gap-6">
            {attemptData.map((attempt, index) => (
              <div key={index} className="flex flex-col items-center mx-px cursor-pointer group" onClick={() => barClick && barClick(index)} title={`Attempt ${index + 1}`}>
                <AnimatedBar success={attempt.success} successRate={attempt.successRate} />
                <div className="text-xs text-gray-400 mt-1 group-hover:text-cyan-400 transition-colors">
                  {format(attempt.timestamp, 'hh:mm:ss a')}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute mx-auto bottom-0 left-0 w-full h-px px-4">
            <div className="flex flex-wrap gap-6 justify-center">
              <div>
                <div className="text-gray-400">Success Rate</div>
                <div className="text-xl font-semibold text-blue-300">{Math.round((attemptData.filter(a => a.success).length / attemptData.length) * 100)}%</div>
              </div>
              <div>
                <div className="text-gray-400">Total Attempts</div>
                <div className="text-xl font-semibold text-blue-300">{attemptData.length}</div>
              </div>
              <div>
                <div className="text-gray-400">Average Time Spent</div>
                <div className="text-xl font-semibold text-blue-300">
                  {Math.round(attemptData.reduce((sum, a) => sum + a.duration, 0) / attemptData.length)}s
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}