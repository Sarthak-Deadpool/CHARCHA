/** @format */

import React, { useState } from "react";
import { Button, VStack } from "@chakra-ui/react";
import { Field, Input, InputGroup, InputElement } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please Fill all Field",
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
        "/api/user/login",
        { email, password },
        config,
      );

      toaster.create({
        title: "Login Successful",
        type: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Something Went Wrong",
        type: "error",
      });

      setLoading(false);
    }
  };

  return (
    <VStack separator={200}>
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
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputElement placement={"end"} width="4.5rem">
              <Button
                bg="#ffecec"
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

      <Button
        colorPalette="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
