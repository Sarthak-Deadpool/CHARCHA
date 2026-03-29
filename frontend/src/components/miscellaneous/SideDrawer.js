/** @format */

import React, { useState } from "react";

import {
  Button,
  Portal,
  CloseButton,
  Drawer,
  Box,
  Input,
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/react";
const SideDrawer = ({ children, open, setOpen }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [loadingChat, setLoadingChat] = useState();

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please enter something in search",
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toaster.create({
        title: "Error in fetching chats",
        type: "error",
      });
    }
  };
  return (
    <>
      {children}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement={"left"}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner position={"left"}>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Search User</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box display={"flex"} paddingBottom={2}>
                  <Input
                    placeholder="Search by Name or Email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <Spinner ml={"auto"} d={"flex"}/>}
              </Drawer.Body>
          
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SideDrawer;
