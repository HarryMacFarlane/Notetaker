import React, { useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { Wrapper } from "../components";

class authProps {

}

const AuthScreen: React.FC<authProps> = ({}) => {
    return (
        <Wrapper>
            <Formik 
                initialValues={{username:"", password:""}}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {({ values, handleChange }) => (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control type="email" id="email" onChange={handleChange} placeholder="example@test.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">    
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <Form.Control type="password" placeholder="Insert Password" />
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default AuthScreen;
