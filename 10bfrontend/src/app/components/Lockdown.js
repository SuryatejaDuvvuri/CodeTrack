"use client";
import { createContext, useContext, useEffect, useState } from 'react';


const LockdownContxt = createContext({
    isLocked: false,
    warning:false,
    logout: () => {},
})

export function LockdownProvider({children}) 
{
    const [isLocked, setIsLocked] = useState(false);
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        const enterScreen = async () => {
            try
            {
                if(document.documentElement.requestFullscreen)
                {
                    await document.documentElement.requestFullscreen()
                    setIsLocked(true);
                }
            }
            catch(err)
            {
                console.error("Could not make it full screen",err);
                setWarning(true);
            }
        };

        enterScreen();

        const handleFullScreen = () => 
        {
            if(!document.fullscreenElement)
            {
                setIsLocked(false);
                setWarning(true)
            }
        }

        document.addEventListener('fullscreenchange',handleFullScreen);

        const handleBlur = () => {
            console.log("User tried to leave the page");
            setWarning(true);
        };

        window.addEventListener('blur',handleBlur)
        const currentUrl = window.location.href;

        const handlePops = (e) => {
            window.history.pushState(null,document.title,currentUrl)

            setWarning(true);
        };
        window.history.pushState(null,document.title,currentUrl)
        window.addEventListener('popstate',handlePops);

        const preventContext = (e) => {
            e.preventDefault();
            return false;
        }

        const removeShortcuts = (e) => {
            if((e.ctrlKey && e.key === 'n') || (e.altKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'w'))
            {
                e.preventDefault()
                return false;
            }
        };
        
        document.addEventListener('contextmenu', preventContext);
        document.addEventListener('keydown',removeShortcuts);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreen);
            if(document.fullscreenElement)
            {
                document.exitFullscreen();
            }
            document.removeEventListener('contextmenu', preventContext);
            document.removeEventListener('keydown',removeShortcuts);
            window.removeEventListener('blur',handleBlur);
            window.removeEventListener('popstate',handlePops)
        }
    },[]);

    const logout = () =>
    {
        if(document.fullscreenElement)
        {
            document.exitFullscreen();
        }

        sessionStorage.clear();

        window.location.href = '/components/login';
    }

    return (
        <LockdownContxt.Provider value = {{isLocked, warning, logout}}>
            {warning && (
                <div className = "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
                <div className = "bg-red-600 text-white p-4 rounded-lg text-center">
                    <h2 className = "text-xl font-bold mb-4">Warning</h2>
                    <p className = "mb-4">Do not switch tabs, or do anything to leave the screen! Please return back or logout to exit</p>
                    <button onClick={() => document.documentElement.requestFullscreen().then(() => setWarning(false))}
                    className = "bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
                        Return
                    </button>
                    <button onClick={logout} className = "bg-gray-700 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>
            )}
            {children}
        </LockdownContxt.Provider>
    )
}

export const useLockdown = () => useContext(LockdownContxt)