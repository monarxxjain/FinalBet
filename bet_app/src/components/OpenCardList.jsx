import React, { useEffect, useState } from "react";
import DetailsCard from "./DetailsCard";
import axios from "axios";

const CardList = () => {
  const [BetList, setBetList] = useState([]);
  const num = localStorage.getItem("phone");

  // Function to check if the date is in the past (resolved)
  const isDateInResolved = (customDateFormat) => {
    // Extract the year, month, day, and time from the custom format
    const [datePart, timePart] = customDateFormat.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    // Create a Date object from the custom format
    const givenDate = new Date(year, month - 1, day, hours, minutes);
    const currentDate = new Date();
    return givenDate <= currentDate;
  };

  // Function to fetch open bets
  const GetOpenBets = async () => {
    try {
      let list1 = await axios.get(
        `http://localhost:5100/api/getbet/${num}/open`
      );
      list1 = list1.data;
      let list2 = await axios.get(
        `http://localhost:5100/api/getbet/${num}/final`
      );
      let ids = [];

      for (let i = 0; i < list1.length; i++) {
        const { resolDate, _id } = list1[i];
        if (isDateInResolved(resolDate)) {
          ids.push(_id);
          list1[i].status = "final";
        }
      }

      list2 = list2.data;
      list2 = [...list2, ...list1];

      setBetList(list2);

      if (ids.length > 0) {
        await axios.patch("http://localhost:5100/api/updatefinal", {
          ids: [...ids],
        });
      }
    } catch (error) {
      console.error("An error occurred while fetching open bets:", error);
    }
  };
  // Function to send a response to the bet
  const SendRespone = async (
    senderPhone,
    receiverPhone,
    id,
    resp,
    senderResp,
    receiverResp,
    sendername,
    receivername
  ) => {
    let check = 0;
    if (senderPhone == num) {
      check = 1;
    }
    if (check == 1) {
      if (receiverResp == "NIL") {
        await axios.patch(`http://localhost:5100/api/setfinalresp/${id}/1`, {
          finalResp: resp,
        });
      } else {
        if (receiverResp == resp) {
          alert("Both participants have given the same response");
        } else {
          await axios.patch(`http://localhost:5100/api/setfinalresp/${id}/1`, {
            finalResp: resp,
          });
          if (resp == "Yes") {
            try {
              await axios.post("http://localhost:5100/api/sendresult", {
                number: senderPhone,
                user: sendername,
                result: "Winner",
              });
              await axios.post("http://localhost:5100/api/sendresult", {
                number: receiverPhone,
                user: receivername,
                result: "Loser",
              });
              
            } catch (error) {
              
            }
            GetOpenBets();
            alert("Congratulations, you won the bet");
          }
          if (resp == "No") {
            try {
              await axios.post("http://localhost:5100/api/sendresult", {
                number: senderPhone,
                user: sendername,
                result: "Loser",
              });
              await axios.post("http://localhost:5100/api/sendresult", {
                number: receiverPhone,
                user: receivername,
                result: "Winner",
              });
              
            } catch (error) {
              
            }
            GetOpenBets();
            alert("You lose");
          }
          await axios.patch(`http://localhost:5100/api/updatestatus/${id}`, {
            status: "close",
          });
        }
      }
    } else {
      if (senderResp == "NIL") {
        await axios.patch(`http://localhost:5100/api/setfinalresp/${id}/0`, {
          finalResp: resp,
        });
      } else {
        if (senderResp == resp) {
          alert("Both participants have given the same response");
        } else {
          await axios.patch(`http://localhost:5100/api/setfinalresp/${id}/0`, {
            finalResp: resp,
          });
          if (resp == "Yes") {
            try {
              await axios.post("http://localhost:5100/api/sendresult", {
                number: senderPhone,
                user: sendername,
                result: "Loser",
              });
              await axios.post("http://localhost:5100/api/sendresult", {
                number: receiverPhone,
                user: receivername,
                result: "Winner",
              });
              
            } catch (error) {
              
            }
            GetOpenBets();
            alert("Congratulations, you won the bet");
          }
          if (resp == "No") {
            try {
              await axios.post("http://localhost:5100/api/sendresult", {
                number: senderPhone,
                user: sendername,
                result: "Winner",
              });
              await axios.post("http://localhost:5100/api/sendresult", {
                number: receiverPhone,
                user: receivername,
                result: "Loser",
              });
              
            } catch (error) {
              
            }
            GetOpenBets();
            alert("You lose");
          }
          await axios.patch(`http://localhost:5100/api/updatestatus/${id}`, {
            status: "close",
          });
        }
      }
    }
    GetOpenBets();
    alert("Your Response is noted");
  };
  useEffect(() => {
    GetOpenBets();
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
          receiverNumber,
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
            status={bet.status}
            Result={"none"}
            FinalsenderResp={senderFinalResp}
            FinalreceiverResp={receiverFinalResp}
            SendRespone={SendRespone}
          />
        );
      })}
    </div>
  );
};

export default CardList;
