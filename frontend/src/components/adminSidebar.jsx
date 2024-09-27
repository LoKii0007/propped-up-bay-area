import React from "react";

const AdminSidebar = ({setActiveView, activeView}) => {

  const menu = [
    {name : 'Clients', 
      img:'/group.png'
    },
    {name : 'Order Requests', 
      img:'/order-delivery.png'
    },
    {name : 'Subscription Customers', 
      img:'/subscribe.png'
    },
    {name : 'Sales Report', 
      img:'/report.png'
    },
    {name : 'Invoices', 
      img:'/bill.png'
    },
  ]

  return (
    <>
      <div className="admin-board mt-5 flex flex-col py-1 items-center gap-2 ">
        
        { menu?.map((data, index)=>(
          <button key={index} onClick={()=>setActiveView(data.name.toLocaleLowerCase() )} className={` ${activeView === data.name.toLocaleLowerCase() && 'bg-gray-200'} font-medium flex py-3 px-8 gap-3 w-full`}>
          <img className="menu-icon" src={data.img} ></img>
          {data.name}
        </button>
        )) }
        
      </div>
    </>
  );
};

export default AdminSidebar
