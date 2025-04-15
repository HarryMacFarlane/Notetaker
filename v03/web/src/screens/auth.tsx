import React, {} from "react";
import { Formik, Form } from "formik";
import { Button, Stack } from "react-bootstrap";
import { InputField, Wrapper } from "../components";
import { useGraphQL } from "../graphql/client";
import { gql } from "graphql-request";
import { toErrorMap, FieldError } from "../util/toErrorMap";
import { useNavigate } from "react-router-dom";

interface authProps {
    email: string
    password: string
}

interface authFormikOnSubmitProps {
    setSubmitting : (arg0 : any) => void
    setStatus : (arg0 : any) => void
    setErrors : (arg0 : { [field : string] : string}) => void
}

interface UserResponse {
    user: {
        id : string
    },
    errors: FieldError[]
}

interface AuthResponse {
    register?: UserResponse,
    login?: UserResponse
}

const REGISTER_MUT = gql`
mutation Register($email : String!, $password : String! ) {
    register(options: { email: $email, password : $password }) {
        user {
            id
        },
        errors {
            field
            message
        }
    }
    }
`

const AuthScreen: React.FC = ({}) => {
    const navigate = useNavigate();
    const qlClient = useGraphQL();

    const submitAuthReq = (values : authProps, { setSubmitting , setStatus, setErrors } : authFormikOnSubmitProps) : void => {
        
        qlClient.client.request<AuthResponse, authProps>(REGISTER_MUT, values)
        .then(
            (response) => {
                console.log(response)
                if (!response.register?.errors){
                    console.log("Login Successful!");
                    navigate("/");
                }
                else {
                    setErrors(toErrorMap(response.register.errors))
                }
            }
        ,
        (err) => {
            console.log(err);
            setStatus("There was an issue on our end. Try again later!");
        })
        .finally(
            () => setSubmitting(false)
        )
    }

    return (
        <Wrapper>
            <Formik 
                initialValues={{email:'', password:''}}
                onSubmit={submitAuthReq}
            >
                {({ isSubmitting, status, errors }) => (
                    
                    <Form className="text-center p-5 m-5">
                        <Stack gap={3}>
                            <InputField name="email" type="email" placeholder="Email"/>
                            <p>{errors.email ? errors.email : null}</p>
                            <InputField name="password" type="password" placeholder="Password"/>
                            <p>{errors.password ? errors.password : null}</p>
                            <Button type="submit" variant="primary" disabled={isSubmitting} >{(!isSubmitting) ? 'Register' : '...Loading'}</Button>
                            <p>{(status) ? status : null}</p>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default AuthScreen;
