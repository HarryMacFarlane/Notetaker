export default function AuthForm() {

    return (
    <>
        <Form>
            <label for="femail"></label><br />
            <input type="text" id="femail" placeholder="Email" name="email" required />
            <br />
            <label for="fpassword"></label><br />
            <input type="password" id="fpassword" placeholder="Password" name="password" required />
            <br />
            <input type="submit" value="Login" />
            <input type="button" value="Register" />
        </Form>
    </>
    );
}