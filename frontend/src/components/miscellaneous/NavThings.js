/** @format */ 
import React from "react";
import {
  Box,
  Button,
  Text,
  Menu,
  Portal,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import SideDrawer from "./SideDrawer";
import { getSender } from "../../config/ChatLogics";
import { useState, useEffect } from "react"; // ✅ add useEffect
import axios from "axios"; // ✅ add axios

const NavThings = () => {
  const { user, notification, setNotification, setSelectedChat, SelectedChat } =
    ChatState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const history = useHistory();
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get("/api/notification", config);
        setNotification(data);
      } catch (error) {
        console.log("Failed to fetch notifications");
      }
    };
    fetchNotifications();
  }, [user]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip showArrow content="Search User to Chat">
          <SideDrawer open={drawerOpen} setOpen={setDrawerOpen}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <i className="fa-solid fa-magnifying-glass fa-lg"></i>
              <Text d={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </SideDrawer>
        </Tooltip>
        <Text
          fontSize={"2xl"}
          fontFamily={"Work sans"}
          fontWeight={"700"}
          letterSpacing={"2px"}
        >
          CHARCHA
        </Text>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          gapX={"10px"}
          alignItems={"center"}
        >
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" size="sm">
                <i className="fa-solid fa-bell fa-lg"></i>

                {[...new Set(notification.map((n) => n.chat._id))].length >
                  0 && (
                  <Box
                    as="span"
                    position="absolute"
                    top="-1px"
                    right="-1px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="bold"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {[...new Set(notification.map((n) => n.chat._id))].length}
                  </Box>
                )}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content p={2}>
                  {!notification.length && (
                    <Menu.Item>No Notification</Menu.Item>
                  )}
                  {notification.map((notif) => (
                    <Menu.Item
                      key={notif._id}
                      cursor={"pointer"}
                      onClick={async () => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n._id !== notif._id),
                        ); // ✅ filter by _id
                        try {
                          const config = {
                            headers: { Authorization: `Bearer ${user.token}` },
                          };
                          await axios.delete(
                            `/api/notification/${notif._id}`,
                            config,
                          );
                        } catch (error) {
                          console.log("Failed to delete notification");
                        }
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(user, notif.chat.users)}`}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root positioning={{ placement: "right-end" }}>
            <Menu.Trigger rounded="full" focusRing="outside">
              <Avatar.Root size="sm">
                <Avatar.Fallback name={user?.name} />
                <Avatar.Image src={user?.pic} />
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    onClick={() => {
                      setSelectedProfile(user);
                      setProfileOpen(true);
                    }}
                  >
                    My Profile
                  </Menu.Item>

                  <Menu.Item value="logout" onClick={logoutHandler}>
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
      <ProfileModal
        user={selectedProfile}
        open={profileOpen}
        setOpen={setProfileOpen}
      />
    </>
  );
};
export default NavThings;

// {* onClick={()=>{
//                   setSelectedChat(notif.chat);
//                   setNotification(notification.filter((n)=> n !== notif))
//                 } *}
