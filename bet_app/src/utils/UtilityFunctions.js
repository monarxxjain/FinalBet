import axios from "axios";

// Function to fetch bet history
export const GetHistory = async () => {
    try {
        let list = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getbet/${num}/close`
        );
        return(list.data);
    } catch (error) {
        console.error("An error occurred while fetching bet history:", error);
    }
};

// Function to fetch lose bets
export const GetloseBets = async () => {
    try {
        let list = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getbet/${num}/close`
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
        return(final_list);
    } catch (error) {
        console.error("An error occurred while fetching lose bets:", error);
    }
};


// Function to fetch open bets
export const GetOpenBets = async () => {
    try {
        let list1 = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getbet/${num}/open`
        );
        list1 = list1.data;
        let list2 = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getbet/${num}/final`
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
        
        
        if (ids.length > 0) {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/updatefinal`, {
                ids: [...ids],
            });
        }
        
        return(list2);
    } catch (error) {
        console.error("An error occurred while fetching open bets:", error);
    }
};


// Function to send a response to the bet
export const SendRespone = async (
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
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/setfinalresp/${id}/1`, {
                finalResp: resp,
            });
        } else {
            if (receiverResp == resp) {
                alert("Both participants have given the same response");
            } else {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/setfinalresp/${id}/1`, {
                    finalResp: resp,
                });
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/updatestatus/${id}`, {
                    status: "close",
                });
                if (resp == "Yes") {
                    alert("Congratulations, you won the bet");
                    GetOpenBets();

                    try {
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                            number: senderPhone,
                            user: sendername,
                            result: "Winner",
                        });
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                            number: receiverPhone,
                            user: receivername,
                            result: "Loser",
                        });
                    } catch (e) {
                        alert("Something went wrong cannot send result message");
                    }
                }
                if (resp == "No") {
                    alert("You lose");
                    GetOpenBets();

                    try {
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                            number: senderPhone,
                            user: sendername,
                            result: "Loser",
                        });
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                            number: receiverPhone,
                            user: receivername,
                            result: "Winner",
                        });
                    } catch (e) {
                        alert("Something went wrong cannot send result message");
                    }
                }
            }
        }
    } else {
        if (senderResp == "NIL") {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/setfinalresp/${id}/0`, {
                finalResp: resp,
            });
        } else {
            if (senderResp == resp) {
                alert("Both participants have given the same response");
            } else {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/setfinalresp/${id}/0`, {
                    finalResp: resp,
                });
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/updatestatus/${id}`, {
                    status: "close",
                });
                if (resp == "Yes") {
                    alert("Congratulations, you won the bet");
                    GetOpenBets();

                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                        number: senderPhone,
                        user: sendername,
                        result: "Loser",
                    });
                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                        number: receiverPhone,
                        user: receivername,
                        result: "Winner",
                    });
                }
                if (resp == "No") {
                    alert("You lose");
                    GetOpenBets();

                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                        number: senderPhone,
                        user: sendername,
                        result: "Winner",
                    });
                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sendresult`, {
                        number: receiverPhone,
                        user: receivername,
                        result: "Loser",
                    });
                }
            }
        }
    }
    GetOpenBets();
    alert("Your Response is noted");
};


// Function to fetch pending bet requests
export const GetRequests = async () => {
    try {
        let list = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getrequest/${num}/pending`
        );
        list = list.data;
        return(list);
    } catch (error) {
        console.error("An error occurred while fetching pending bets:", error);
    }
};

// Function to delete a bet request
export const DeleteBet = async (id) => {
    try {
        let result = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/deletebet/${id}`
        );
        GetRequests(); // Refresh the bet list after deletion
    } catch (error) {
        console.error("An error occurred while deleting the bet:", error);
    }
};

// Function to accept a bet request
export const AcceptBet = async (id, resolDate, senderNumber, receiverNumber) => {
    try {
        let result = await axios.patch(
            `${process.env.REACT_APP_BACKEND_URL}/api/updatestatus/${id}`,
            {
                status: "open",
            }
        );
        GetRequests(); // Refresh the bet list after accepting the request
        console.log(receiverNumber);
        let msg2 = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/sendresolupdate/${id}`,
            {
                resolDate: resolDate,
                number: receiverNumber,
            }
        );
        // Perform scheduled tasks here
        console.log(senderNumber);
        let msg1 = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/sendresolupdate/${id}`,
            {
                resolDate: resolDate,
                number: senderNumber,
            }
        );


        console.log(`Scheduled message sent for: ${resolDate}`);
    } catch (error) {
        console.error("An error occurred while accepting the bet:", error);
    }
};


// Function to fetch closed bets with wins
export const getWins = async () => {
    try {
        let list = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/getbet/${num}/close`
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

        return(finalList);
    } catch (error) {
        console.error("An error occurred while fetching bets:", error);
    }
};