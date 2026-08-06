import React, { useState } from 'react'
import { RxCaretDown } from "react-icons/rx";
import { MdSearch } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
export default function Header() {
    const [toggle, setToggle] = useState(false);
    const showSideMenu = () =>{
        setToggle(true);
    }
    const hideSideMenu = () =>{
        setToggle(false);
    }
    const links = [
        {
            icon:<MdSearch/>,
            name:"Search"
        },
        {
            icon:<RiDiscountPercentLine />,
            name:"Offers",
            sup:"New"
        },
        {
            icon:<IoMdHelpCircleOutline />,
            name:"Help"
        },
        {
            icon:<MdOutlineShoppingCart />,
            name:"Cart"
        },
        {
            icon:<CgProfile />,
            name:"Sign In"
        },
    ]
  return (
    <>
    <div className='black-overlay w-full h-full fixed duration-500' onClick={hideSideMenu} style={{
        opacity: toggle ? 1 : 0,
        visibility: toggle ? "visible" : "hidden"
    }}>
        <div onClick={(e) => {e.stopPropagation()}} className='w-[500px] bg-white h-full absolute duration-[400ms]'
             style={{
                left: toggle ? '0%' : '-100%'
            }}
        ></div>
    </div>
    <header className='p-3 shadow-xl'>
        <div className='max-w-[1200px] mx-auto flex items-center'>
            <div className='w-[100px] h-[70px]'>
                <img className='h-[69px]' src="/images/logo.png" alt="" />
            </div>
            <div><span  className='font-bold border-b-[3px] border-[black]'>Ratu</span> Ranchi, Jharkhand, India <RxCaretDown fontSize={25} className='inline text-[#fc8019] cursor-pointer' onClick={showSideMenu}/></div>
            <nav className='flex list-none gap-5 ml-auto text-[18px] font-semibold'>
                {
                    links.map(
                        (link,index) => {
                            return <li 
                            key={index}
                            className='cursor-pointer flex hover:text-[#fc8019] items-center gap-2  duration-[400ms]'>
                                {link.icon}
                                <span>{link.name}</span>
                                <sup>{link.sup}</sup>
                            </li>
                        }
                    )
                }
            </nav>
        </div>
    </header>
    </>
  )
}
