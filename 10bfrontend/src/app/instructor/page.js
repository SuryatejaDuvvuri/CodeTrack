import Image from "next/image";
import Link from "next/link"
export default function Instructor() {
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

      <div className = "flex flex-col gap-6 my-8 mb-auto">
        <div className = "bg-gray-800 rounded-lg p-4">
            <h2 className = "text-xl font-bold mb-4">Roster</h2>

            <div className = "space-y-2">
               <div className = "bg-amber-800 p-3 rounded cursor-pointer">
                    <div className = "font-medium">Suryateja Duvvuri</div>
                    <div className = "text-sm text-gray-300">NetId: sduvv003</div>
                    <div className = "text-xs">Progress: 75%</div>
                </div> 

                <button className = "w-full bg-cyan-400 text-white py-2 rounded mt-4">
                    + Add Student
                </button>
            </div>
        </div>

        <div className = "md:w-3/4">
            <div className = "bg-gray-800 rounded-lg p-6 mb-6">
                <div className = "flex justify-between items-start">
                    <div>
                        <h2 className = "text-xl font-bold">Suryateja Duvvuri</h2>
                        <p className = "text-gray-300">NetID: sduvv003</p>
                    </div>
                    <button className = "bg-red-400 text-white px-4 py-1 rounded">
                        Remove
                    </button>
                </div>

                <div className = "grid grid-cols-1 gap-6 mt-6">
                    <div>
                        <h3 className = "text-lg mb-3">Progress</h3>
                        <div className = "w-full bg-gray-700 rounded-full h-5">
                            <div className = "bg-green-500 h-5 rounded-full" style={{width:"75%"}}></div>
                        </div>
                        <div className = "flex justify-between items-center text-sm mt-1">
                            <span>75%</span>
                            <span>20/40 problems</span>
                        </div>
                    </div>
                    <div>
                        <h3 className = "text-lg mb-3">
                            Top 5
                        </h3>
                    </div>
                </div>
            </div>
        </div>
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
