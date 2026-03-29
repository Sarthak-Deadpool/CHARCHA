/** @format **/
import React, { useEffect, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Text, Avatar, Spinner, Field, Input } from "@chakra-ui/react";
import { getSender } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useState } from "react";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./miscellaneous/ScrollableChat";
import { toaster } from "./ui/toaster";
import "./style.css";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/Typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [open, setOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSetting: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Trouble to load messages",
        type: "error",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // useEffect(() => {
  //   socket.on("message recieved", (newMessageRecieved) => {
  //     if (
  //       !selectedChatCompare ||
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //     ) {
  //       if (!notification.includes(newMessageRecieved)) {
  //         setNotification([newMessageRecieved, ...notification]);
  //         setFetchAgain(!fetchAgain);
  //       }
  //     } else {
  //       setMessages([...messages, newMessageRecieved]);
  //     }
  //   });
  // });

//   useEffect(() => {
//   socket.off("message recieved");

//   socket.on("message recieved", (newMessageRecieved) => {
//     if (
//       !selectedChatCompare ||
//       selectedChatCompare._id !== newMessageRecieved.chat._id
//     ) {
//       setNotification((prev) => {
//         if (prev.find((n) => n.chat._id === newMessageRecieved.chat._id)) return prev;
//         return [newMessageRecieved, ...prev];
//       });
//       setFetchAgain((prev) => !prev);
//     } else {
//       setMessages((prev) => [...prev, newMessageRecieved]);
//     }
//   });
// }); 


// ❌ Remove the entire commented out old useEffect

// ✅ Replace your current useEffect with this
useEffect(() => {
  socket.off("message recieved");
  socket.off("notification received");

  socket.on("message recieved", (newMessageRecieved) => {
    if (
      !selectedChatCompare ||
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      setMessages((prev) => [...prev, newMessageRecieved]);
    }
  });

  socket.on("notification received", (newMessageRecieved) => {
    if (
      !selectedChatCompare ||
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      setNotification((prev) => {
        if (prev.find((n) => n.chat._id === newMessageRecieved.chat._id)) return prev;
        return [newMessageRecieved, ...prev];
      });
      setFetchAgain((prev) => !prev);
    }
  });
}, []); // ✅ empty array — critical!
  
  

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config,
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: "Error",
          description: "Something Went Wrong",
          type: "error",
        });
      }
    }
  };

  const typingRef = useRef(false);
  const lastTypingTime = useRef(null);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!typingRef.current) {
      typingRef.current = true;
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    lastTypingTime.current = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime.current;

      if (timeDiff >= timerLength && typingRef.current) {
        typingRef.current = false;
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      }
    }, timerLength);
  };

  const otherUser = !selectedChat?.isGroupChat
    ? selectedChat?.users?.find((u) => u._id !== user._id)
    : null;

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            px={2}
            width={"100%"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <Box
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Box>

            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={otherUser} open={open} setOpen={setOpen}>
                  <Avatar.Root size="sm" cursor="pointer">
                    <Avatar.Fallback name={otherUser?.name} />
                    <Avatar.Image src={otherUser?.pic} />
                  </Avatar.Root>
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            padding={3}
            bg={"#e8e8e8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Field.Root onKeyDown={sendMessage} required mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOption}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"outline"}
                bg={"#E8E8E8"}
                placeholder="Type Message Here"
                onChange={typingHandler}
                value={newMessage}
              />
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} paddingBottom={3} fontFamily={"Work Sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
