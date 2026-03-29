/** @format */

import React, { useState } from "react";
import {
  Button,
  Avatar,
  Dialog,
  Portal,
  CloseButton,
  Text,
  Center,
  IconButton,
  Drawer,
  Field,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children, open, setOpen }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();
  
  const handleSearch = async (query) => {
    setLoading(true);
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName) {
      toaster.create({
        title: "Fill the group name",
        type: "warning",
      });
      return;
    }
    if (selectedUsers.length === 0) {
      toaster.create({
        title: "Add group member",
        type: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );

      setChats([data, ...chats])
      setOpen(false);
      toaster.create({
        title:"Group created",
        type:"success"
      })
    } catch (error) {
         toaster.create({
        title:"Something went wrong",
        type:"error"
      })
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toaster.create({
        title: "User already added",
        type: "warning",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild>
          <span>{children}</span>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header
                fontSize={"35px"}
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Dialog.Title>Create Group</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
              >
                <Field.Root>
                  <Input
                    placeholder="Enter Group Name"
                    marginBottom={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Input
                    placeholder="Add Users"
                    marginBottom={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>
                <Box
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
                  justifyContent={"left"}
                  m={3}
                  flexWrap={"wrap"}
                >
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Box>

                {loading ? (
                  <Box>Loading....</Box>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Button onClick={handleSubmit}>Create</Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;
