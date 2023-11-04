import React, { useState } from 'react'
import { SendRespone } from '../utils/UtilityFunctions';

const List = () => {
    const [BetList, setBetList] = useState([]);
    const num = localStorage.getItem("phone");
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
                      Result={"none"}
                      FinalsenderResp={senderFinalResp}
                      FinalreceiverResp={receiverFinalResp}
                      SendWag={senderWager}
                      RecevieWag={receiverWager}
                      WagerStatus={WagerStatus}
                      DeleteBet={DeleteBet}
                      AcceptBet={AcceptBet}
                      SendRespone={SendRespone}
                  />
              );
          })}    
    </div>
  )
}

export default List
