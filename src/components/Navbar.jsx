import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="flex justify-end items-center bg-blue-500 text-white p-1">
      <Link to="/" className="mr-4 px-4 py-2 border-orange-400 border-solid border rounded-lg">
      Lessons
      </Link>
      <Link to="/games" className="mr-4 px-4 py-2 border-orange-400 border-solid border rounded-lg">
      Games
      </Link>
    </div>
  )
}

export default Navbar