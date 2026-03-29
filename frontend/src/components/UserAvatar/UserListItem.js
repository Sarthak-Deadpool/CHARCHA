/** @format */

import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({user, handleFunction }) => {
  if(!user){
    return
  }
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      width="100%"
      display={"flex"}
      alignItems={"center"}
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius={"5px"}
    >
      <Avatar.Root size="sm" mr={2} >
        <Avatar.Fallback name={user?.name} />
        <Avatar.Image src={user?.pic} />
      </Avatar.Root>

      <Box>
        <Text>{user?.name}</Text>
        <Text fontSize={"xs"} >
            <b>Email: </b>
            {user?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
