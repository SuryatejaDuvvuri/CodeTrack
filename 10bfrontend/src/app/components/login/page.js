import Image from "next/image";
import Link from "next/link"
export default function Login() {
  return (
    <div className="container flex flex-col m-auto min h-screen px-4 font-sans justify-center items-center">
        <div className = "mb-8">
          <h1 className = "text-xl font-bold text-white">CS010B Practice Portal</h1>
        </div>

        <div className = "rounded-xl p-8 w-full">
          <h2 className = "text-2xl font-semibold text-white text-center">Welcome!</h2>

          <div className = "space-y-4">
            <div className = "flex items-center justify-center w-full">
               <button className = "bg-blue-600 mb-auto text-white px-6 py-3 rounded-lg shadow-sm hover:font-bold">
                Sign in with Google
              </button>
            </div>
          </div>
           <div className = "grid grid-rows-1 gap-4">
                <div className = "flex items-center mx-4">
                  <div className = "flex-grow border-t border-gray-600"></div>
                      <span className = "px-3 text-gray-400 text-sm">Continue as</span>
                      <div className = "flex-grow border-t border-gray-600"></div>
                </div>
                 <Link href = "/components/instructor" className = "text-white mb-auto px-6 py-3 rounded-lg shadow-sm bg-gray-700">
                      Instructor
                </Link>
                <Link href = "/" className = "text-white mb-auto px-6 py-3 rounded-lg shadow-sm bg-gray-700">
                      Student
                </Link>
              </div>
        </div>
       
      
       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">About</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
        <div className=  "mt-4 text-gray-500 text-sm">
          &copy; 2025 CS010B Practice Portal. Made with Love
        </div>
     </footer>
      
    </div>

  );
}
