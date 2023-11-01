import DetailsCard from "./DetailsCard";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReqestBetList = () => {
  const [BetList, setBetList] = useState([]);
  const num = localStorage.getItem("phone");

  // Function to fetch pending bet requests
  const GetRequests = async () => {
    try {
      let list = await axios.get(
        `http://localhost:5100/api/getrequest/${num}/pending`
      );
      list = list.data;
      setBetList(list);
    } catch (error) {
      console.error("An error occurred while fetching pending bets:", error);
    }
  };

  // Function to delete a bet request
  const DeleteBet = async (id) => {
    try {
      let result = await axios.delete(
        `http://localhost:5100/api/deletebet/${id}`
      );
      GetRequests(); // Refresh the bet list after deletion
    } catch (error) {
      console.error("An error occurred while deleting the bet:", error);
    }
  };

  // Function to accept a bet request
  const AcceptBet = async (id, resolDate, senderNumber, receiverNumber) => {
    try {
      let result = await axios.patch(
        `http://localhost:5100/api/updatestatus/${id}`,
        {
          status: "open",
        }
      );
      GetRequests(); // Refresh the bet list after accepting the request

      // Perform scheduled tasks here
      let msg1 = await axios.post(
        `http://localhost:5100/api/sendresolupdate/${id}`,
        {
          resolDate: resolDate,
          number: senderNumber,
        }
      );

      let msg2 = await axios.post(
        `http://localhost:5100/api/sendresolupdate/${id}`,
        {
          resolDate: resolDate,
          number: receiverNumber,
        }
      );

      console.log(`Scheduled message sent for: ${resolDate}`);
    } catch (error) {
      console.error("An error occurred while accepting the bet:", error);
    }
  };

  useEffect(() => {
    GetRequests();
  }, []);

  if (BetList.length === 0) {
    return (
      <div className="w-[96%] pb-4 h-full text-2xl font-semibold text-black flex justify-center items-center">
        No Bets Yet....
      </div>
    );
  }

  return (
    <div className="w-[96%] pb-4 h-full flex flex-col scroller">
      {BetList.map((bet, index) => {
        const {
          senderName,
          senderResponse,
          receiverName,
          receiverResponse,
          receiverNumber,
          senderNumber,
          criteria,
          resolDate,
          wager,
          senderFinalResp,
          receiverFinalResp,
        } = bet;
        return (
          <DetailsCard
            key={index}
            Betid={bet._id}
            sender={senderName}
            senderResp={senderResponse}
            receiver={receiverName}
            receiverResp={receiverResponse}
            senderphone={senderNumber}
            receiverNumber={receiverNumber}
            description={criteria}
            ResolutionDate={resolDate}
            Wager={wager}
            status={"pending"}
            DeleteBet={DeleteBet}
            AcceptBet={AcceptBet}
            Result={"none"}
          />
        );
      })}
    </div>
  );
};

export default ReqestBetList;
