import DetailsCard from "./DetailsCard";
import React, { useEffect, useState } from "react";
import axios from "axios";

const WinList = () => {
  const [BetList, setBetList] = useState([]);
  const num = localStorage.getItem("phone");

  // Function to fetch closed bets with wins
  const getWins = async () => {
    try {
      let list = await axios.get(
        `http://localhost:5100/api/getbet/${num}/close`
      );
      list = list.data;
      let finalList = [];

      for (let i = 0; i < list.length; i++) {

        if (list[i].senderNumber == num && list[i].senderFinalResp == "Yes") {

          finalList.push(list[i]);
        }
        if (
          list[i].receiverNumber == num &&
          list[i].receiverFinalResp == "Yes"
        ) {

          finalList.push(list[i]);
        }
      }

      setBetList(finalList);
    } catch (error) {
      console.error("An error occurred while fetching bets:", error);
    }
  };

  useEffect(() => {
    getWins();
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
          senderNumber,
          receiverName,
          receiverResponse,
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
            description={criteria}
            ResolutionDate={resolDate}
            Wager={wager}
            status={bet.status}
            Result={"win"}
            FinalsenderResp={senderFinalResp}
            FinalreceiverResp={receiverFinalResp}
          />
        );
      })}
    </div>
  );
};

export default WinList;
