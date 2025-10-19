"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';

export default function ScreenShotProtect({ children }) {
    const [isProtected, setIsProtected] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const visibilityTimestamp = useRef(0);
    const warnTimeout = useRef(null);
    const keyState = useRef({
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
    });

    useEffect(() => {
        const role = typeof window !== "undefined" ? localStorage.getItem('role') : null;
        setUserRole(role);
        
        if (role === 'INSTRUCTOR') {
            return;
        }

        const applyProtection = () => {
            const style = document.createElement('style');
            style.textContent = `
                .protected-content {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    position: relative;
                    overflow: hidden;
                }
                @media print {
                    .protected-content * {
                        visibility: hidden !important;
                        background: black !important;
                        color: black !important;
                    }
                    .protected-content::after {
                        content: "Content Protected";
                        visibility: visible !important;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: red !important;
                        font-size: 24px;
                        background: white !important;
                        padding: 20px;
                        border: 2px solid red;
                        z-index: 999999;
                    }
                }
            `;
            document.head.appendChild(style);
            setIsProtected(true);
        };

        const logActivity = async (action, details = {}) => {
            const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
            const timestamp = new Date().toISOString();
            
            console.log(`Activity Log: ${action}`, { ...details, timestamp, netid });
            try {
                await fetch('/api/log-activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action,
                        details,
                        timestamp,
                        netid,
                        userAgent: navigator.userAgent,
                        url: window.location.href
                    })
                });
            } catch (error) {
                console.log('Failed to log activity:', error);
            }
        };

        const showWarning = (message = "Action detected") => {
            const exist = document.querySelector('.screenshot-warning-overlay');
            if (exist) {
                const messageElement = exist.querySelector('.warning-message');
                if (messageElement) {
                    messageElement.textContent = message;
                }
                return;
            }

            const warning = document.createElement('div');
            warning.className = 'screenshot-warning-overlay';
            warning.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.95);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999999;
                    font-family: Arial, sans-serif;
                ">
                    <div style="text-align: center; padding: 30px; max-width: 500px; background: rgba(31, 41, 55, 0.9); border-radius: 12px; border: 1px solid #374151;">
                        <h2 style="color: #fbbf24; margin-bottom: 20px; font-size: 24px;">Activity Detected</h2>
                        <p style="font-size: 18px; margin-bottom: 20px; color: #d1d5db;" class="warning-message">${message}</p>
                        <p style="font-size: 14px; margin-bottom: 25px; color: #9ca3af;">This activity has been logged for security purposes.</p>
                        <button id="continue"
                            style="padding: 12px 24px; 
                            background: #3b82f6; 
                            color: white; border: none; border-radius: 8px;
                            cursor: pointer; font-size: 16px; font-weight: 600;
                            transition: background 0.2s;">
                            Continue
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(warning);

            const continueButton = warning.querySelector('#continue');
            continueButton.addEventListener('mouseenter', () => {
                continueButton.style.background = '#2563eb';
            });
            continueButton.addEventListener('mouseleave', () => {
                continueButton.style.background = '#3b82f6';
            });
            continueButton.addEventListener('click', () => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            });

            setTimeout(() => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            }, 5000);
        };

        const detect = () => {
            const handle = (e) => {
                logActivity('key_press', {
                    key: e.key,
                    code: e.code,
                    metaKey: e.metaKey,
                    shiftKey: e.shiftKey,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey
                });

                if (e.key === 'Control' || e.ctrlKey) {
                    keyState.current.ctrlKey = true;
                }
                if (e.key === 'Meta' || e.metaKey) {
                    keyState.current.metaKey = true;
                }
                if (e.key === 'Shift' || e.shiftKey) {
                    keyState.current.shiftKey = true;
                }

                if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
                    e.preventDefault();
                    logActivity('screenshot_attempt', { combination: `${e.metaKey ? 'Cmd' : 'Ctrl'}+Shift+${e.key}` });
                    showWarning("Screenshot attempt detected");
                    return false;
                }

                if (e.key === 'PrintScreen') {
                    e.preventDefault();
                    logActivity('screenshot_attempt', { method: 'PrintScreen' });
                    showWarning("Screenshot attempt detected");
                    return false;
                }

                if (e.key === 'F12') {
                    e.preventDefault();
                    logActivity('devtools_attempt', { key: 'F12' });
                    showWarning("Developer tools access blocked");
                    return false;
                }

                if ((e.ctrlKey || e.metaKey) && ['c', 'v'].includes(e.key.toLowerCase())) {
                    logActivity('clipboard_action', { action: e.key.toLowerCase() === 'c' ? 'copy' : 'paste' });
                }
            };

            const handleKeyUp = (e) => {
                if (e.key === 'Control') {
                    keyState.current.ctrlKey = false;
                }
                if (e.key === 'Meta') {
                    keyState.current.metaKey = false;
                }
                if (e.key === 'Shift') {
                    keyState.current.shiftKey = false;
                }
            };

            const handleVisibilityChange = () => {
                const now = Date.now();
                const visible = document.visibilityState === 'visible';

                setIsTabVisible(visible);

                if (!visible) {
                    visibilityTimestamp.current = now;
                    logActivity('tab_hidden', { timestamp: now });
                    
                    warnTimeout.current = setTimeout(() => {
                        showWarning("Tab switch detected - activity logged");
                    }, 2000);
                } else {
                    if (warnTimeout.current) {
                        clearTimeout(warnTimeout.current);
                    }

                    const hideTime = now - visibilityTimestamp.current;
                    if (hideTime > 5000) 
                    { 
                        logActivity('tab_restored', { hideDuration: hideTime });
                        showWarning(`Tab was hidden for ${Math.round(hideTime/1000)} seconds`);
                    }
                }
            };

            const handleBlur = () => {
                logActivity('window_blur', { timestamp: Date.now() });
                setIsTabVisible(false);
            };

            const handleFocus = () => {
                logActivity('window_focus', { timestamp: Date.now() });
                setIsTabVisible(true);
            };

            const blockRightClick = (e) => {
                const target = e.target;
                const isCodeEditor = target.closest('.cm-editor') || target.closest('.CodeMirror');
                
                if (!isCodeEditor) {
                    e.preventDefault();
                    logActivity('right_click_attempt', { target: target.tagName });
                    showWarning("Right-click logged");
                    return false;
                }
            };

            document.addEventListener('keydown', handle, true);
            document.addEventListener('keyup', handleKeyUp, true);
            document.addEventListener('contextmenu', blockRightClick, true);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleBlur);
            window.addEventListener('focus', handleFocus);

            return () => {
                document.removeEventListener('keydown', handle, true);
                document.removeEventListener('keyup', handleKeyUp, true);
                document.removeEventListener('contextmenu', blockRightClick, true);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('blur', handleBlur);
                window.removeEventListener('focus', handleFocus);

                if (warnTimeout.current) {
                    clearTimeout(warnTimeout.current);
                }
            };
        };

        applyProtection();
        const cleanUp = detect();
        return cleanUp;
    }, []);

    if (userRole === 'INSTRUCTOR') 
    {
        return <div className="min-h-screen">{children}</div>;
    }

    return (
        <div className={`${isProtected ? 'protected-content' : ''} min-h-screen`}>
            {children}
        </div>
    );
}