/** @format */

import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { toaster } from "./ui/toaster";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [open, setOpen] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Something went wrong",
        status: "error",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={3}
      marginRight={{base:"3"}}
      backgroundColor="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={{base:"25px", md:"20px"}}>My Chats</Text>

        <GroupChatModal open={open} setOpen={setOpen}>
          <Button
            display="flex"
            gap="6px"
            fontSize={{ base: "17px", md: "14px", lg: "17px" }}
          >
            <Box>
             <i className="fa-solid fa-users"></i>
            </Box>
            <i className="fa-solid fa-plus"></i>
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        padding={3}
        backgroundColor={"#f2f2f2"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
