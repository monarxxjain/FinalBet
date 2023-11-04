import React, { useEffect, useState } from "react";
import {
  AcceptBet,
  DeleteBet,
  GetHistory,
  GetOpenBets,
  GetRequests,
  GetloseBets,
  SendRespone,
  WagerStatus,
  getWins,
} from "../utils/UtilityFunctions";
import DetailsCard from "./DetailsCard";

const List = ({ BetList, setBetList }) => {
  const num = localStorage.getItem("phone");
  // Function to check if the date is in the past (resolved)

 
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
          receiverNumber,
          criteria,
          resolDate,
          wager,
          senderFinalResp,
          receiverFinalResp,
          senderWager,
          receiverWager,
        } = bet;
        let result = "none";
        if (bet.status == "close") {
          if (
            (senderNumber == num && senderFinalResp == "Yes") ||
            (receiverNumber == num && receiverFinalResp == "Yes")
          ) {
            result = "win";
          }
          if (
            (senderNumber == num && senderFinalResp == "No") ||
            (receiverNumber == num && receiverFinalResp == "No")
          ) {
            result = "lose";
          }
        }

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
            status={bet.status}
            Result={result}
            FinalsenderResp={senderFinalResp}
            FinalreceiverResp={receiverFinalResp}
            SendWag={senderWager}
            RecevieWag={receiverWager}
            WagerStatus={WagerStatus}
            DeleteBet={DeleteBet}
            AcceptBet={AcceptBet}
            SendRespone={SendRespone}
            setBetList={setBetList}
          />
        );
      })}
    </div>
  );
};

export default List;
