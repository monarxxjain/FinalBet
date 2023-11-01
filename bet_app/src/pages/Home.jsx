import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import CardList from "../components/OpenCardList";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // Function to get user information
  const getUser = async () => {
    try {
      const user = await axios.get(
        `http://localhost:5100/user/${localStorage.getItem("user")}`
      );
      setUsername(user.data.name);
    } catch (error) {
      console.error("Error while fetching user data:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getUser();
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex bg-blue-100 flex-col">
      <Nav username={username} />
      <div className="py-3 flex w-full justify-around my-2 text-black mt-2 border-solid border-b-2 border-slate-600">
        <span className="font-semibold md:text-xl cursor-pointer relative liner">
          <NavLink className="nav_link" to={"/home/request"}>
            Bet Request
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink className="nav_link" to={"/home/open"}>
            Open Bets
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink className="nav_link" to={"/home/wins"}>
            Wins
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink className="nav_link" to={"/home/lose"}>
            Loses
          </NavLink>
        </span>
        <span className="font-semibold md:text-xl cursor-pointer">
          <NavLink className="nav_link" to={"/home/history"}>
            History
          </NavLink>
        </span>
      </div>
      <div className="w-full h-full overflow-y-scroll scroller scroll-smooth  flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
