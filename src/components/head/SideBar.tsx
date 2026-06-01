export default function SideBar() {
  return (
    <div className="w-64 h-screen bg-background-900 text-white p-4">  
        <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
        <ul>
            <li className="mb-2"><a href="#" className="hover:text-gray-400">Home</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-400">Profile</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-400">Settings</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-400">Logout</a></li>
        </ul>
    </div>
  )
}