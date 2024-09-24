import React from "react";

const Sidebar = ({setActiveView, activeView}) => {

  const menu = [
    {name : 'Dashboard', 
      img:'/monitor.png'
    },
    {name : 'Order', 
      img:'/plus.png'
    },
    {name : 'Removal', 
      img:'/trash.png'
    },
    // {name : 'Visit', 
    //   img:'/location-mark.png'
    // },
    // {name : 'History', 
    //   img:'/history.png'
    // },
    {name : 'Profile', 
      img:'/user.png'
    },
    {name : 'Payment Info', 
      img:'/credit-card.png'
    },
  ]

  return (
    <>
      <div className="board-top mt-5 flex flex-col py-1 items-center gap-2 ">
        
        { menu?.slice(0, menu.length-2).map((data, index)=>(
          <button key={index} onClick={()=>setActiveView(data.name.toLocaleLowerCase() )} className={` ${activeView === data.name.toLocaleLowerCase() && 'bg-gray-200'} font-medium flex py-3 px-8 gap-3 w-full`}>
          <img className="menu-icon" src={data.img} ></img>
          {data.name}
        </button>
        )) }
        
      </div>
      <div className="board-bottom flex flex-col mb-5">
      { menu?.slice( menu.length-2, menu?.length).map((data, index)=>(
          <button key={index} onClick={()=>setActiveView(data.name.toLocaleLowerCase() )} className={` ${activeView === data.name.toLocaleLowerCase() && 'bg-gray-200'} flex py-3 px-8 gap-3 w-full`}>
          <img className="menu-icon" src={data.img} ></img>
          {data.name}
        </button>
        )) }
      </div>
    </>
  );
};

export default Sidebar;
