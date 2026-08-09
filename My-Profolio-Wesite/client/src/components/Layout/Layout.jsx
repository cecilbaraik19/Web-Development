import React, {useState} from 'react';
import Home from '../../pages/Home/Home';
import './Layout.css';
import { MdKeyboardDoubleArrowLeft,MdKeyboardDoubleArrowRight } from "react-icons/md";

const Layout = () => {
  const [toggle,setToggle] = useState(true);

  //change toggle
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <>
      <div className="sidebar-section">
        <div className={toggle ? "sidebar-toggle sidebar" : "sidebar"}>
          <div className="sidebar-toggle-icons">
            <p onClick={handleToggle}>
              {
                toggle? ( <MdKeyboardDoubleArrowLeft size={40} />) : (<MdKeyboardDoubleArrowRight size={40} />)
              }
            </p>
          </div>
        </div>
        <div className="container">
          <Home/>
        </div>
      </div>
    </>
  )
}

export default Layout