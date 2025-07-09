import Image from "next/image";
import Link from "next/link"
export default function Login() {
  return (
    <div className="container flex flex-col mx-auto min h-screen font-sans justify-center items-center">
      
        <button className = "bg-blue-600 mb-auto text-white px-6 py-3 rounded-lg shadow-sm hover:font-bold">
        Sign in with Google
       </button>
       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
     </footer>
      
    </div>

  );
}
