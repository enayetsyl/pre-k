import { Link } from "react-router-dom";


const Lessons = () => {
  return (
    <div className="font-sans text-green-800 leading-6">
      <h3 className="font-bold">A. Numbers to 3</h3>
      <ul className="list-none pl-0">
        <li className="flex items-center">
          <span className="text-gray-400 mr-2">★</span>
          <Link to="/identify3" className="hover:underline">
            1 Identify numbers - up to 3
          </Link>
        </li>
        <li className="flex items-center">
          <span className="text-gray-400 mr-2">★</span>
          <Link to="/hear3" className="hover:underline">
            2 Choose the number that you hear - up to 3
          </Link>
        </li>
      </ul>
      <h3 className="font-bold">B. Counting to 3</h3>
      <ul className="list-none pl-0">
        <li className="flex items-center">
          <span className="text-gray-400 mr-2">★</span>
          <Link to="/learn3" className="hover:underline">
            1 Learn to count - up to 3
          </Link>
        </li>
        <li className="flex items-center">
          <span className="text-gray-400 mr-2">★</span>
          <Link to="/count3" className="hover:underline">
            3 Count dots - up to 3
          </Link>
        </li>
      </ul>
       
    </div>
  );
};

export default Lessons