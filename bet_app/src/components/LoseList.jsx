import DetailsCard from "./DetailsCard";
import React, { useEffect, useState } from "react";
import axios from "axios";

const LoseList = () => {
  const [BetList, setBetList] = useState([]);

  const num = localStorage.getItem("phone");

  // Function to fetch lose bets
  const GetloseBets = async () => {
    try {
      let list = await axios.get(
        `http://localhost:5100/api/getbet/${num}/close`
      );
      let final_list = [];
      list = list.data;

      for (let i = 0; i < list.length; i++) {
        if (list[i].senderNumber == num && list[i].senderFinalResp == "No") {
          final_list.push(list[i]);
        }
        if (
          list[i].receiverNumber == num &&
          list[i].receiverFinalResp == "No"
        ) {
          final_list.push(list[i]);
        }
      }
      setBetList(final_list);
    } catch (error) {
      console.error("An error occurred while fetching lose bets:", error);
    }
  };

  useEffect(() => {
    GetloseBets();
  }, []);

  if (BetList.length == 0) {
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
            Result={"lose"}
            FinalsenderResp={senderFinalResp}
            FinalreceiverResp={receiverFinalResp}
          />
        );
      })}
    </div>
  );
};

export default LoseList;
