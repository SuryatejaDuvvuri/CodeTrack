"use client";
import { useEffect, useState, useRef } from 'react';
import { tinykeys } from "tinykeys";

export default function ScreenShotProtect({ children }) {
    const [isProtected, setIsProtected] = useState(false);
    const [isTabVisible, setIsTabVisible] = useState(true);
    const visibilityTimestamp = useRef(0);
    const warnTimeout = useRef(null);
    const keyState = useRef({
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
    });

    useEffect(() => {
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
                    -webkit-backdrop-filter: blur(0px);
                    backdrop-filter: blur(0px);
                    position: relative;
                    overflow: hidden;
                }
                .protected-content::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                    z-index: -1;
                    pointer-events: none;
                }
                @media print {
                    .protected-content * {
                        visibility: hidden !important;
                        background: black !important;
                        color: black !important;
                    }
                    
                    .protected-content::after {
                        content: "Protection";
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

        const showWarning = (message = "Restricted action") => {
            console.log(`Blocked: ${message}`);

            const exist = document.querySelector('.screenshot-warning-overlay');
            if (exist) {
                const messageElement = exist.querySelector('.warning-message');
                if (messageElement) {
                    messageElement.textContent = message;
                }
                return;
            }

            const warning = document.createElement('div');
            const KeysPressed = keyState.current.ctrlKey || 
                              keyState.current.metaKey || 
                              keyState.current.shiftKey;

            warning.className = 'screenshot-warning-overlay';
            warning.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999999;
                    font-family: Arial, sans-serif;
                ">
                    <div style="text-align: center; padding: 20px; max-width: 500px;">
                        <h2 style="color: #ff4a4a; margin-bottom: 20px;">Protection Active</h2>
                        <p style="font-size: 18px; margin-bottom: 15px;" class="warning-message">${message}</p>
                        ${KeysPressed ? `<div>Release the keys</div>` : ''}
                        <button id="continue" ${KeysPressed ? 'disabled' : ''}
                            style="margin-top: 20px; padding: 10px 20px; 
                            background: ${KeysPressed ? '#555' : '#dc2626'}; 
                            color: white; border: none; border-radius: 5px;
                            cursor: ${KeysPressed ? 'not-allowed' : 'pointer'};">
                            Continue
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(warning);

            const continueButton = warning.querySelector('#continue');
            const checkKeys = setInterval(() => {
                const KeysStillPressed = keyState.current.ctrlKey || 
                                      keyState.current.metaKey || 
                                      keyState.current.shiftKey;
                
                if (KeysStillPressed) {
                    continueButton.disabled = true;
                    continueButton.style.background = '#555';
                    continueButton.style.cursor = 'not-allowed';
                } else {
                    continueButton.disabled = false;
                    continueButton.style.background = '#dc2626';
                    continueButton.style.cursor = 'pointer';
                }
            }, 100);

            continueButton.addEventListener('click', () => {
                clearInterval(checkKeys);
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            });
        };

        const detect = () => {
            const handle = (e) => {
                console.log('Key down:', {
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

                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    showWarning("Cannot use these keys");
                    return false;
                }

                if (e.key === 'PrintScreen' || e.key === 'F12' || e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    showWarning("Cannot print or take screenshots");
                    return false;
                }

                if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    showWarning("Cannot take screenshots");
                    return false;
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

                console.log('Tab visibility changed:', {
                    visible: visible,
                    timestamp: now,
                    timeSinceLast: now - visibilityTimestamp.current
                });

                setIsTabVisible(visible);

                if (!visible) {
                    visibilityTimestamp.current = now;
                    warnTimeout.current = setTimeout(() => {
                        showWarning("Tab switched");
                    }, 1000);
                } else {
                    if (warnTimeout.current) {
                        clearTimeout(warnTimeout.current);
                    }

                    const hideTime = now - visibilityTimestamp.current;
                    if (hideTime > 3000) {
                        showWarning(`Tab was hidden`);
                    }
                }
            };

            const blur = () => {
                console.log("Lost focus");
                setIsTabVisible(false);
                setTimeout(() => {
                    if (!document.hasFocus()) {
                        showWarning("Window focus lost");
                    }
                }, 300);
            };

            const focus = () => {
                console.log("Window got focus");
                setIsTabVisible(true);
            };

            const blockRightClick = (e) => {
                e.preventDefault();
                showWarning("Right-click blocked");
                return false;
            };

            const blockClipboard = (e) => {
                e.preventDefault();
                showWarning("No Copy/Pasting");
                return false;
            };

            document.addEventListener('keydown', handle, true);
            window.addEventListener('keydown', handle, true);
            document.addEventListener('contextmenu', blockRightClick, true);
            window.addEventListener('contextmenu', blockRightClick, true);
            document.addEventListener('visibilitychange', handleVisibilityChange, true);
            window.addEventListener('blur', blur, true);
            window.addEventListener('focus', focus, true);
            document.addEventListener('keyup', handleKeyUp, true);
            window.addEventListener('keyup', handleKeyUp, true);
            document.addEventListener('copy', blockClipboard, true);
            document.addEventListener('cut', blockClipboard, true);
            document.addEventListener('paste', blockClipboard, true);

            return () => {
                document.removeEventListener('contextmenu', blockRightClick, true);
                window.removeEventListener('contextmenu', blockRightClick, true);
                document.removeEventListener('keydown', handle, true);
                window.removeEventListener('keydown', handle, true);
                document.removeEventListener('keyup', handleKeyUp, true);
                window.removeEventListener('keyup', handleKeyUp, true);
                window.removeEventListener('blur', blur, true);
                window.removeEventListener('focus', focus, true);
                document.removeEventListener('copy', blockClipboard, true);
                document.removeEventListener('cut', blockClipboard, true);
                document.removeEventListener('paste', blockClipboard, true);

                if (warnTimeout.current) {
                    clearTimeout(warnTimeout.current);
                }
            };
        };

        applyProtection();
        const cleanUp = detect();
        return cleanUp;
    }, []);

    return (
        <div className={`${isProtected ? 'protected-content' : ''} min-h-screen`}>
            {children}
        </div>
    );
}
