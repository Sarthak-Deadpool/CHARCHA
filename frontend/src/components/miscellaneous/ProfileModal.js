/** @format */

import React from "react";
import {
  Dialog,
  Portal,
  Button,
  IconButton,
  Text,
  Avatar,
  CloseButton,
  Center,
} from "@chakra-ui/react";

const ProfileModal = ({ user, open, setOpen, children }) => {
  if (!user) return null;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)} // ✅ IMPORTANT
    >
      {/* Trigger */}
      {children && (
        <span onClick={() => setOpen(true)}>{children}</span>
      ) }

      {/* Modal */}
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content h="410px">
            <Dialog.Header>
              <Dialog.Title
                fontSize="40px"
                fontFamily="Work sans"
                textAlign="center"
                width="100%"
              >
                {user?.name}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Center
                flexDirection="column"
                gap="20px"
                justifyContent="space-between"
              >
                <Avatar.Root size="2xl">
                  <Avatar.Image src={user?.pic} />
                  <Avatar.Fallback name={user?.name} />
                </Avatar.Root>

                <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  fontFamily="Work sans"
                >
                  Email: {user?.email}
                </Text>
              </Center>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
