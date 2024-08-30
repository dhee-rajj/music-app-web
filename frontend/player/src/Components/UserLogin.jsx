import { gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import "../Styles/UserLogin.css";

// Define the LOGIN mutation
const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            user {
                username
            }
            success
            token
        }
    }
`;

const UserLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            onLoginSuccess();
        }
    }, [onLoginSuccess]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const variables = { username, password };

        try {
            const response = await loginUser({ variables });
            if (
                response.data &&
                response.data.tokenAuth &&
                response.data.tokenAuth.success
            ) {
                localStorage.setItem(
                    "authToken",
                    response.data.tokenAuth.token
                );
                onLoginSuccess();
            } else {
                // Handle login failure (e.g., show error message)
                console.error(
                    "Login failed:",
                    response.data?.tokenAuth?.message || "Unknown error"
                );
            }
        } catch (err) {
            // Handle error (e.g., show error message)
            console.error("Error during login:", err);
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                <div className="form-field">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    className="login-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {error && <p>Error: {error.message}</p>}
            {data && !data.login.success && (
                <p>Login failed. Please try again.</p>
            )}
        </div>
    );
};

export default UserLogin;
