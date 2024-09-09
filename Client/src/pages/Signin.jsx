import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both email and password are provided
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out both email and password!");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Make the API request to sign in
      const res = await axios.post("/api/auth/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Allows cookies to be sent/received with request
      });

      // Check if the sign-in was successful
      if (res && res.status === 200) {
        toast.success("Signed in successfully");
        setLoading(false);
        navigate("/"); // Navigate to the home page or dashboard on success
      } else {
        // Handle unexpected non-successful responses
        setErrorMessage("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      // Handle error responses from the backend
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.status === 400) {
          // Handle "Incorrect email or password" or "All fields are required" errors
          setErrorMessage(error.response.data.message);
        } else if (error.response.status === 404) {
          // Handle "User not found" errors
          setErrorMessage("User not found!");
        } else {
          // Handle other errors
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        // Catch-all error for unexpected issues
        setErrorMessage("Something went wrong. Please try again.");
      }

      // Optionally, log the error for debugging purposes
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left  */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog
            </span>
            Sphere
          </Link>
          <p className="text-sm mt-5">
            This is ultimate blogger app. Sign up to create your blog or to see
            the blogs !
          </p>
        </div>
        {/* right  */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  {/* <span className="pt-3">Loading...</span> */}
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account ?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
