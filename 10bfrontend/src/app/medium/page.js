import Image from "next/image";
import Link from "next/link"
export default function Medium() {
  return (
    <div className="container mx-auto min h-screen font-sans m-4 flex flex-col justify-center items-center">
      <nav className = "bg-black">
        <div className = "flex flex-wrap justify-between items-center p-4">
          <div className="flex space-x-4">
            <a href = "#" className = "text-white hover:text-lg transition-all">Profile</a>
            <a href = "/" className = "text-white hover:text-lg transition-all">Home</a>
            <a href = "#" className = "text-white hover:text-lg transition-all">Logout</a>
          </div>
        </div>

      </nav>
      <div className = "grid grid-cols-3 gap-4 mb-auto">
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 1</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 2</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 3</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 4</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 5</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 6</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 7</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 8</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 9</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 10</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 11</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 12</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 13</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 14</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
        <Link className = "block bg-amber-400 rounded-lg shadow-sm p-6 hover:scale-110 transition-all" href = "/problem">
          <h1 className=  "mb-2 text-xl font-bold tracking-tight">Medium 15</h1>
          <div className = "font-normal text-sm">This is a description of a problem</div>
        </Link>
       
      </div>

       <div className = "mb-2 font-medium text-gray-500">
            Progress Completed
          </div>
          <div className = "w-full bg-gray-700 rounded-full h-5 mb-4">
            <div className = "bg-cyan-400 text-sm font-medium text-white p-1 text-center leading-none h-5 rounded-full" style={{width:"40%"}}>60%</div>
       </div>

       <footer className = "w-full mt-8 mb-4 px-4 rounded-lg shadow-sm">
        <div className = "flex justify-center space-x-4">
          <a href = "#" className = "text-gray-300">Home</a>
          <a href = "#" className = "text-gray-300">Contact</a>
          
        </div>
     </footer>
      
    </div>

  );
}
