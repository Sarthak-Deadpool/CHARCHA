/** @format */
import {
  Dialog,
  Portal,
  Button,
  Input,
  Box,
  IconButton,
  Spinner,
  Field,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { toaster } from "../ui/toaster";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config); // ✅ query not search
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to Load the Search Results",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error?.response?.data?.message,
        type: "error",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toaster.create({
        title: "User Already in group!",
        type: "error",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id, 
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error",
      description: error?.response?.data?.message,
        type: "error",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (userToRemove) => {
  if (!userToRemove) return;

  const adminId = (selectedChat.groupAdmin?._id || selectedChat.groupAdmin)?.toString();
  const currentUserId = user._id?.toString();
  const removeUserId = userToRemove._id?.toString();

  if (adminId !== currentUserId && removeUserId !== currentUserId) {
    toaster.create({
      title: "Only admins can remove someone!",
      type: "error",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const { data } = await axios.put(
      `/api/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      },
      config
    );

    removeUserId === currentUserId ? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    if (typeof fetchMessages === "function") fetchMessages(); 
    setLoading(false);
  } catch (error) {
    toaster.create({
      title: "Error",
      description: error?.response?.data?.message || "Failed to remove user",
      type: "error",
    });
    setLoading(false);
  }
  setGroupChatName("");
};

  return (
    <>
      <IconButton
        variant="ghost"
        rounded="full"
        aria-label="Update Group"
        onClick={() => setOpen(true)}
      >
       <i className="fa-solid fa-users"></i>
      </IconButton>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>

              <Dialog.Header>
                <Dialog.Title
                  fontSize="35px"
                  fontFamily="Work sans"
                  textAlign="center"
                  width="100%"
                >
                  {selectedChat.chatName}
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.CloseTrigger />

              <Dialog.Body display="flex" flexDirection="column" alignItems="center">
                <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Box>

                <Field.Root display="flex" mb={3}>
                  <Input
                    placeholder="Chat Name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    ml={2}
                    colorScheme="teal"
                    loading={renameloading} 
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </Field.Root>

              
                <Field.Root mb={3} width="100%">
                  <Input
                    placeholder="Add User to group"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>

               
                {loading ? (
                  <Spinner size="lg" />
                ) : (
                  searchResult?.map((searchedUser) => ( 
                    <UserListItem
                      key={searchedUser._id}
                      user={searchedUser}
                      handleFunction={() => handleAddUser(searchedUser)}
                    />
                  ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Button colorScheme="red" onClick={() => handleRemove(user)}>
                  Leave Group
                </Button>
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

export default UpdateGroupChatModal;