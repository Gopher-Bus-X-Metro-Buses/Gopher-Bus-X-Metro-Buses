import React, { useState } from 'react';
import Map from './Map'
import Routes from './gtfs/Routes.ts';
import "./styles.css"
import Vehicles from './gtfs/Vehicles.ts';

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [_, setForceUpdate] = useState(0);

  const toggleNav = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // selects specific route depending on button pressed
  const selectRoute = (route) => {
    if (Routes.getURLRoutes().indexOf(route) === -1) {
      Routes.addURLRoute(route)
    } else {
      Routes.removeURLRoute(route)
    }

    Routes.refresh();
    Vehicles.refresh();
    setForceUpdate(Math.random()); // updates color of button click immediately
  };

  // Creates a route button with the route that the button leads to and the route that it leads to
  function RouteButton({route, text}) {
    const isActive = Routes.getURLRoutes().includes(route); // used to check if route button is active
    return (
      <button 
        className={`route-btn ${isActive ? 'active' : ''} route-${route}`} 
        onClick={() => selectRoute(route)}>{text}
      </button> 
    )
  }

  // I can't figure out how to link the button being clicked to displaying the specific route
  return (
    <>
      <div id="nav-bar" className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="nav-header">
          <h3>Select Routes</h3>
          <div className="underline"></div>
        </div>
        <div className="sidebar-content">
          <RouteButton route={"121"} text={"121 Campus Connector"}/>
          <RouteButton route={"122"} text={"122 University Avenue Circulator"}/>
          <RouteButton route={"123"} text={"123 4th Street Circulator"}/>
          <RouteButton route={"124"} text={"124 St. Paul Campus Circulator"}/>
          <RouteButton route={"120"} text={"120 East Bank Circulator"}/>
          <RouteButton route={"2"} text={"2 Franklin Av / To Hennepin"}/>
          <RouteButton route={"6"} text={"6U 27Av-Univ / Via France"}/>
          <RouteButton route={"3"} text={"3 U of M / Como Av / Dwtn Mpls"}/>
          <RouteButton route={"902"} text={"Metro Green Line"}/>
          <RouteButton route={"901"} text={"Metro Blue Line"}/>
        </div>
      </div>
      <div id="nav-bar">
        <button className="openbtn" onClick={toggleNav}>
          &#9776;
        </button>
      </div>
      <div id = "main">
        <button className="AboutButton" onClick={openAboutPage}>
         &#8942;
        </button>
      </div>

    </>
  );
}
function openAboutPage() {
    // Navigate to another page
  window.location.href = 'About-Page.html';
}
export default function App() {
  return (
    <>
      <div id="title-bar">
        <h1>
          <span className="gopher">Gopher Buses </span>
          <span className="X"> X </span>
          <span className="city"> Metro Buses</span>
        </h1>
      </div>
      <NavBar />
      <Map />
    </>
  );
}
