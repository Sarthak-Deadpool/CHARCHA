import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const isAdmin = admin?._id === user?._id || admin === user?._id;

  return (
    <Box
      display={"flex"}
      gap={2}
      alignItems={"center"}
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontSize={12}
      background={isAdmin ? "purple.500" : "black"} // ✅ different color for admin
      color={"white"}
      cursor={isAdmin ? "default" : "pointer"}       // ✅ no pointer for admin
      onClick={!isAdmin ? handleFunction : undefined} // ✅ no click for admin
    >
      {user?.name}
      {isAdmin ? (
        <span style={{ fontSize: 10 }}>(Admin)</span> // ✅ show admin label
      ) : (
        <i className="fa-solid fa-x"></i>             // ✅ only show X for non-admin
      )}
    </Box>
  )
}

export default UserBadgeItem