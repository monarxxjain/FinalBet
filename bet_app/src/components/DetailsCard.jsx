import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

const DetailsCard = ({
  Betid,
  sender,
  senderResp,
  senderphone,
  receiver,
  receiverResp,
  receiverNumber,
  description,
  ResolutionDate,
  Wager,
  status,
  DeleteBet,
  AcceptBet,
  SendRespone,
  FinalsenderResp,
  FinalreceiverResp,
  Result,
}) => {
  // CSS classes for different card styles
  const normal =
    "w-full tbl flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";
  const lose =
    "w-full lose flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";
  const win =
    "w-full win flex items-start px-5 py-3 my-3 lg:flex-row flex-col justify-evenly";

  // Get the current user's phone number
  const phone = localStorage.getItem("phone");
  const [Isender, setIsender] = useState(false);
  useEffect(() => {
    if (senderphone == phone) {
      setIsender(true);
    } else {
      setIsender(false);
    }
  }, []);


  return (
    <div
      className={
        (Result == "none" && normal) ||
        (Result == "lose" && lose) ||
        (Result == "win" && win)
      }
    >
      <div className="flex my-2">
        <span className="flex flex-col mx-3  text-black">
          <span className="text-lg font-semibold">Bet Initiator</span>
          <span className="text-lg font-light">{sender}</span>
        </span>
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Response</span>
          <span className="text-lg font-light">{senderResp}</span>
        </span>
      </div>
      <div className="flex my-2">
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Bet Receiver</span>
          <span className="text-lg font-light">{receiver}</span>
        </span>
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Response</span>
          <span className="text-lg font-light">{receiverResp}</span>
        </span>
      </div>

      <span className="flex flex-col max-h-[12rem] lg:max-w-[38%] mx-3  my-2 text-black">
        <span className="text-lg font-semibold">Description</span>
        <span className="text-lg font-light overflow-y-scroll scroller">
          {description}
        </span>
      </span>
      <div className="flex my-2">
        <span className="flex flex-col mx-3 text-black">
          <span className="text-lg font-semibold">Date Of Resolution</span>
          <span className="text-lg font-light">{ResolutionDate}</span>
        </span>
        <span className="flex flex-col mx-3  text-black">
          <span className="text-lg font-semibold">Wager</span>
          <span className="text-lg font-light">{Wager}</span>
        </span>
      </div>
      {status == "pending" && (
        <div className="flex lg:flex-col  justify-evenly h-full mx-3 ">
          <button
            className="text-[3rem] lg:mx-0 mx-4 text-green-600 active:scale-105 duration-200 "
            onClick={() => {
              AcceptBet(Betid, ResolutionDate, senderphone, receiverNumber);
            }}
          >
            <AiOutlineCheckCircle />
          </button>
          <button
            className="text-[3rem] text-red-600 active:scale-105 duration-200 "
            onClick={() => {
              DeleteBet(Betid);
            }}
          >
            <RxCrossCircled />
          </button>
        </div>
      )}
      {((status == "final" && Isender && FinalsenderResp == "NIL") ||
        (status == "final" && !Isender && FinalreceiverResp == "NIL")) && (
        <div className="flex flex-col mx-3">
          <div className="text-black font-semibold text-lg">
            Was this Bet Result in your Favour?
          </div>
          <div className="flex justify-around my-3">
            <button
              className="text-xl mx-3 bg-blue-600 text-black font-semibold py-1 px-2 rounded-md active:scale-105 duration-200 "
              onClick={() => {
                SendRespone(
                  senderphone,
                  receiverNumber,
                  Betid,
                  "Yes",
                  FinalsenderResp,
                  FinalreceiverResp,
                  sender,
                  receiver
                );
              }}
            >
              YES
            </button>
            <button
              className="text-xl bg-red-600 text-black font-semibold py-1 px-2 rounded-md active:scale-105 duration-200 "
              onClick={() => {
                SendRespone(
                  senderphone,
                  receiverNumber,
                  Betid,
                  "No",
                  FinalsenderResp,
                  FinalreceiverResp,
                  sender,
                  receiver
                );
              }}
            >
              NO
            </button>
          </div>
        </div>
      )}
      {((status == "final" && Isender && FinalsenderResp != "NIL") ||
        (status == "final" && !Isender && FinalreceiverResp != "NIL")) && (
        <div className="flex h-full items-center justify-center flex-col mx-3">
          <div className="text-black font-bold text-xl">
            Your response was {Isender ? FinalsenderResp : FinalreceiverResp}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsCard;
