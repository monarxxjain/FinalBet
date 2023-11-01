import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [PhoneEmp, setPhoneEmp] = useState(false);
  const [PhoneErr, setPhoneErr] = useState(false);
  const [PassEmp, setPassEmp] = useState(false);
  const [PassErr, setPassErr] = useState(false);
  const phone = useRef();
  const pass = useRef();
  const navigate = useNavigate();

  // Function to navigate to the registration page
  const sign = () => {
    navigate("/");
  };

  // Function to validate a phone number format
  const validatePhone = (phone) => {
    return String(phone)
      .toLowerCase()
      .match(/^(?:\+\d{1,3})?\d{10}$/);
  };

  // Function to handle user login
  const handleRegister = async (e) => {
    const Phone = phone.current.value;
    const Pass = pass.current.value;
    let b = 0,
      c = 0;

    if (!Phone) {
      setPhoneEmp(true);
    } else {
      setPhoneEmp(false);
      if (validatePhone(Phone)) {
        b = 1;
        setPhoneErr(false);
      } else {
        setPhoneErr(true);
      }
    }

    if (!Pass) {
      setPassEmp(true);
    } else {
      setPassEmp(false);
      if (Pass.length < 6) {
        setPassErr(true);
      } else {
        setPassErr(false);
        c = 1;
      }
    }

    if (b + c === 2) {
      try {
        const data = await axios.post("http://localhost:5100/login", {
          phone: Phone,
          password: Pass,
        });

        if (data) {
          const { auth, user } = data.data;
          localStorage.setItem("token", auth);
          localStorage.setItem("user", user._id);
          localStorage.setItem("phone", user.phone);
          navigate("/home/open");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-100">
      <div className="shadow-2xl flex flex-col z-10  sm:rounded-lg p-5 sm:px-10 px-13 items-start sm:w-max w-full sm:h-max h-full">
        <div className=" font-semibold text-[1.7rem] mt-1 flex w-full ">
          Welcome to BetApp
        </div>

        <div className="flex flex-col ">
          <span className="text-slate-900 font-normal my-2 text-xl mb-3">
            Phone
          </span>
          <input
            type="tel"
            className="border border-gray-300 sm:w-72 w-64 h-10 rounded-lg outline-none px-2 py-2 font-medium "
            ref={phone}
          />
          {PhoneEmp && (
            <small className="text-red-600 text-[1rem] ">
              Please enter the phone
            </small>
          )}
          {PhoneErr && (
            <small className="text-red-600 text-[1rem] ">Invalid phone</small>
          )}
        </div>
        <div className="flex flex-col my-2">
          <span className="text-slate-900 font-normal my-2 text-xl mb-3">
            Password
          </span>
          <input
            type="password" // Change input type to password for secure entry
            className="sm:w-72 w-64 h-10 rounded-lg outline-none px-2 py-2 font-medium"
            ref={pass}
          />
          {PassEmp && (
            <small className="text-red-600 text-[1rem] ">
              Please enter the password
            </small>
          )}
          {PassErr && (
            <small className="text-red-600 text-[1rem] ">
              Password must have at least 6 characters
            </small>
          )}
        </div>
        <div className="flex w-full items-center justify-center mt-7 mb-5">
          <button
            className="text-xl bg-blue-500 text-slate-50 px-4 py-2 font-semibold rounded-lg w-full active:scale-105 duration-200  "
            onClick={() => {
              handleRegister();
            }}
          >
            Login
          </button>
        </div>
        <div className="text-slate-900">
          Don't have an account?
          <span
            className="font-bold cursor-pointer ml-1"
            onClick={() => {
              sign();
            }}
          >
            Sign Up
          </span>{" "}
          instead
        </div>
      </div>
    </div>
  );
};

export default Login;
