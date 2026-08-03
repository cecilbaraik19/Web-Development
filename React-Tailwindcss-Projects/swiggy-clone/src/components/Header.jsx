import React, { useState } from 'react'
import { RxCaretDown } from "react-icons/rx";
export default function Header() {
    const [toggle, setToggle] = useState(false);
    const showSideMenu = () =>{
        setToggle(true);
    }
    const hideSideMenu = () =>{
        setToggle(false);
    }
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
        </div>
    </header>
    </>
  )
}
