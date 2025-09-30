'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function EmbeddedContent()
{
    const search = useSearchParams();
    const router = useRouter();
    const url = search.get('url');
    const title = search.get('title');
    const [isValid, setIsValid] = useState(false);

    const resources = 
    [
        'asciitable.com',
        'codewithharry.com',
        'learncpp.com',
        'stackoverflow.com',
        'youtube.com',
        'youtu.be',
        'cppreference.com',
    ];

    useEffect(() => {
        if(url)
        {
            setIsValid(resources.some(d => url.includes(d)));
        }

        const focus = setInterval(() => {
            if(document.activeElement && document.activeElement.tagName === 'IFRAME')
            {
                window.focus();
            }
        },1000);

        return () => clearInterval(focus);
    },[url]);

    const handleClose = () => {
        if(window.opener)
        {
            window.close();
        }
        else
        {
            router.back();
        }
    }

    if(!url)
    {
        return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <p className="text-white">No URL provided</p>
        </div>
        );
    }

    if (!isValid) {
        return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
            <p className="text-red-400 mb-4">Access to this resource is not allowed</p>
            <button 
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
                Go Back
            </button>
            </div>
        </div>
        );
    }

    const getUrl = (original) => 
    {
        if(original.includes('youtube.com/watch?v='))
        {
            const id = original.split('v=')[1].split('&')[0];
            return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&controls=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0&color=white&theme=dark&cc_load_policy=1&playsinline=1&widget_referrer=${encodeURIComponent(window.location.href)}`;
        }
        if (original.includes('youtu.be/')) 
        {
            const idd = original.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube-nocookie.com/embed/${idd}?modestbranding=1&rel=0&controls=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0&color=white&theme=dark&cc_load_policy=1&playsinline=1&widget_referrer=${encodeURIComponent(window.location.href)}`;
        }
        return original;
    };

    const embed = getUrl(url);
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

    return (
        <div className = "min-h-screen bg-gray-900 text-white">
            <header className = "w-full py-4 px-6 bg-gray-800">
                <div className = "flex justify-between items-center">
                    <h1 className = "text-xl font-semibold">{title || 'Learning Resource'}</h1>
                    <button onClick = {handleClose} className = "px-4 py-2 rounded-lg transition-colors bg-red-500 hover:bg-red-600">
                        Close
                    </button>
                </div>
            </header>

            <main className = "flex-1 relative">
                <iframe src = {embed}  className="w-full h-screen border-0"
                title={title || 'Learning Resource'}
                allow={isYoutube ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" : ""}
                allowFullScreen={false}
                referrerPolicy="no-referrer"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                style={{ height: 'calc(100vh - 80px)',userSelect: 'none'}}
                onError={() => setIsValid(false)}
                />
            
            </main>
        </div>
    )
}

export default function EmbeddedViewer() 
{
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    }>
      <EmbeddedContent />
    </Suspense>
  );
}