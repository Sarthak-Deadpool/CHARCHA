/** @format */

import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import NavThings from "../components/miscellaneous/NavThings";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <NavThings />}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        padding={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain}/>
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
