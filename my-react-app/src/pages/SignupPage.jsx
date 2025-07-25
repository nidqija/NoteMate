import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { GiPenguin } from 'react-icons/gi';
import { useState } from 'react';
import Navbar01 from '../components/IntroNavbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../CreateClient';
import { Alert } from 'react-bootstrap';

function SignUpPage() {
  const [loginPage, setLoginPage] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Correct password matching logic
    if (password !== confirmpass) {
      setAlertVariant("danger");
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // ✅ Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAlertVariant("danger");
        setMessage(error.message);
        return;
      }

      const user = data?.user;

      if (!user) {
        setAlertVariant("danger");
        setMessage("Signup failed, please try again");
        return;
      }

      // ✅ Insert username into Profile table
      const { error: profileError } = await supabase.from("Profile").insert({
        user_id: user.id,
        username: username,
      });

      if (profileError) {
        setAlertVariant("danger");
        setMessage("Failed to store username: " + profileError.message);
        return;
      }

      // ✅ Successful sign up
      setLoginPage(true);
      setAlertVariant("success");
      setMessage("Sign up successful! Check your emails to verify your account");

    } catch (err) {
      console.error("Unexpected error:", err);
      setAlertVariant("danger");
      setMessage("Unexpected error occurred.");
    }
  };


  const handleLogin = async(e) =>{
    e.preventDefault();

    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(error){
      setAlertVariant("danger");
      setMessage(error.message);
    } else {
      setAlertVariant("success");
      setMessage("Login successful! Redirecting...");
      navigate("/home");
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(24, 22, 26)' }}>
      <Container>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: '100vh' }}
        >
          <h3 className=" mt-3 mb-4 text-white" style={{ fontFamily: 'Hanken Grotesk' }}>
            <GiPenguin /> NoteMate!
          </h3>

          <Card
            style={{
              width: '30rem',
              backgroundColor: 'rgb(24, 22, 26)',
              borderColor: 'white',
              borderWidth: '5px',
              borderRadius: '15px',
            }}
          >
            <Form onSubmit={loginPage ? handleLogin : handleSubmit} style={{ backgroundColor: 'rgb(24, 22, 26)', borderRadius: '15px' }}>
              <Container className="p-5">
                <h3
                  className="text-center mb-5 text-white"
                  style={{ fontFamily: 'Hanken Grotesk' }}
                >
                  {loginPage ? 'Log In' : 'Sign Up'}
                </h3>

                {message && (
                  <Alert variant={alertVariant} dismissible onClose={() => setMessage("")}>
                    {message}
                  </Alert>
                )}

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label
                    className="text-white"
                    style={{ fontFamily: 'Hanken Grotesk' }}
                  >
                    Email address
                  </Form.Label>
                  <Form.Control
                    style={{ fontFamily: 'League Spartan' }}
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text
                    className="text-white mt-3"
                    style={{ fontFamily: 'Hanken Grotesk' }}
                  >
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                {!loginPage && (
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label
                      className="text-white"
                      style={{ fontFamily: 'Hanken Grotesk' }}
                    >
                      New Username
                    </Form.Label>
                    <Form.Control
                      style={{ fontFamily: 'League Spartan' }}
                      type="text"
                      placeholder="Enter new username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label
                    className="text-white"
                    style={{ fontFamily: 'Hanken Grotesk' }}
                  >
                    Password
                  </Form.Label>
                  <Form.Control
                    style={{ fontFamily: 'League Spartan' }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                {!loginPage && (
                  <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label
                      className="text-white"
                      style={{ fontFamily: 'Hanken Grotesk' }}
                    >
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      style={{ fontFamily: 'League Spartan' }}
                      type="password"
                      placeholder="Confirm password"
                      value={confirmpass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-4" controlId="formBasicCheckbox">
                  <Form.Check
                    style={{ fontFamily: 'Hanken Grotesk' }}
                    className="text-white"
                    type="checkbox"
                    label="Check me out"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label
                    style={{ fontFamily: 'League Spartan' }}
                    className="mb-3 text-white"
                  >
                    {loginPage ? (
                      <>
                        Don't have an account?{' '}
                        <span
                          onClick={() => setLoginPage(false)}
                          style={{
                            cursor: 'pointer',
                            fontFamily: 'League Spartan',
                            textDecoration: 'none',
                            padding: '5px',
                            borderRadius: '10px',
                            backgroundColor: 'white',
                            color: 'black',
                          }}
                        >
                          Sign Up!
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <span
                          onClick={() => setLoginPage(true)}
                          style={{
                            cursor: 'pointer',
                            fontFamily: 'League Spartan',
                            textDecoration: 'none',
                            padding: '5px',
                            borderRadius: '10px',
                            backgroundColor: 'white',
                            color: 'black',
                          }}
                        >
                          Log In!
                        </span>
                      </>
                    )}
                  </Form.Label>
                </Form.Group>

                <Button variant="light" type="submit">
                  Submit
                </Button>
              </Container>
            </Form>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default SignUpPage;
