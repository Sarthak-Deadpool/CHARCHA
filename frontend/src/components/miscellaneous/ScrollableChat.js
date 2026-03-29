/** @format */

import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
import { Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Avatar.Root size="xs" cursor="pointer">
                <Avatar.Fallback name={message.sender?.name} />
                <Avatar.Image src={message.sender?.pic} />
              </Avatar.Root>
            )}

            <span style={{
                backgroundColor : `${
                    message?.sender?._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding:"5px 15px",
                maxWidth:"75%",
                marginLeft: isSameSenderMargin(messages, message, index, user._id),
                marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
            }}
            >{message.content}</span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
