"use strict";

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import fetch from "isomorphic-unfetch";
import { login } from "../utils/auth";

export default () => {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .matches(
            /^\w+$/,
            "Usernames can only consist of letters, numbers, and underscores."
          )
          .required("Please choose a username."),
        password: Yup.string().required("Please choose a password.")
      })}
      onSubmit={async values => {
        try {
          const response = await fetch("/api/register", {
            method: "POST",
            headhers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
          });
          if (response.status === 200) {
            const { token } = await response.json();
            login({ token }, false);
          } else {
            console.log("Registration failed.");
            // https://github.com/developit/unfetch#caveats
            let err = new Error(response.statusText);
            err.response = response;
            throw err;
          }
        } catch (err) {
          console.error(
            "You have an error in your code or there are network issues.",
            err
          );
        }
      }}
    >
      {formik => (
        <Form
          noValidate
          onSubmit={formik.handleSubmit}
          className="mx-auto"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="ampersand">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="username"
                aria-describedby="ampersand"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                isInvalid={formik.touched.username && !!formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};
