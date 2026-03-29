/** @format */

import React, { useState } from "react";
import { Button, FieldLabel, VStack } from "@chakra-ui/react";
import { Field, Input, InputGroup, InputElement } from "@chakra-ui/react";
import { toaster } from "../ui/toaster"
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      toaster.create({
        title: "Please Select an Image",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dpby0hell");

      fetch("https://api.cloudinary.com/v1_1/dpby0hell/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        title: "Please Select a JPEG or PNG image",
        type: "warning",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Fields",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      toaster.create({
        title: "Registration Successful",
        type: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // history.push("/chats");
    } catch (error) {
      toaster.create({
        title: error?.response?.data?.message || "Error Occurred",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <VStack gap={4}>
      <Field.Root id="first-name" required>
        <Field.Label>
          Name
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </Field.Root>

      <Field.Root id="email" required>
        <Field.Label>
          Email
          <Field.RequiredIndicator />
        </Field.Label>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field.Root>

      <Field.Root id="password" required>
        <Field.Label>
          Password
          <Field.RequiredIndicator />
        </Field.Label>

        <InputGroup>
          <>
            <Input
              type={show ? "text" : "password"}
              placeholder="Set Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputElement placement="end" width="4.5rem">
              <Button
                bg="gray"
                color="black"
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputElement>
          </>
        </InputGroup>
      </Field.Root>

      <Field.Root id="confirm-password" required>
        <Field.Label>
          Confirm Password
          <Field.RequiredIndicator />
        </Field.Label>

        <InputGroup>
          <>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <InputElement placement="end" width="4.5rem">
              <Button
                bg="gray"
                color="black"
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputElement>
          </>
        </InputGroup>
      </Field.Root>

      <Field.Root id="pic">
        <FieldLabel>Upload Your Picture</FieldLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Field.Root>

      <Button
        colorPalette="blue"
        width="100%"
        mt={3}
        onClick={submitHandler}
        isLoading={loading}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default SignUp;