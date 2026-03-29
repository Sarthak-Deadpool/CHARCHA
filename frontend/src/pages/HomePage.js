/** @format */

import React from "react";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="rgb(235, 227, 197)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          CHARCHA
        </Text>
      </Box>

      {/* Tabs Section */}
      <Box
        w="100%"
        bg="rgb(235, 227, 197)"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs.Root
          defaultValue="members"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "#b3dfec",
            "--tabs-indicator-shadow": "rgb(0,0,0)",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List marginBottom="1em" display={"flex"}>
            <Tabs.Trigger value="members" flex={1}>
              Login
            </Tabs.Trigger>
            <Tabs.Trigger value="projects" flex={1}>
              SignUp
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value="members">
            <Login />
          </Tabs.Content>

          <Tabs.Content value="projects">
            <SignUp />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
