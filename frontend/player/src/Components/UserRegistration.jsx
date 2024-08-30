import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import "../Styles/UserRegistration.css";

const REGISTER_USER = gql`
    mutation Register(
        $username: String!
        $email: String!
        $password1: String!
        $password2: String!
    ) {
        register(
            username: $username
            email: $email
            password1: $password1
            password2: $password2
        ) {
            success
            errors
            token
            refreshToken
        }
    }
`;

const VERIFY_ACCOUNT = gql`
    mutation VerifyAccount($token: String!) {
        verifyAccount(token: $token) {
            success
            errors
        }
    }
`;

const RESEND_VERIFICATION_EMAIL = gql`
    mutation ResendActivationEmail($email: String!) {
        resendActivationEmail(email: $email) {
            success
            errors
        }
    }
`;

const UserRegistration = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });
    const [verificationToken, setVerificationToken] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [timer, setTimer] = useState(0);
    const [resendVerificationEmail] = useMutation(RESEND_VERIFICATION_EMAIL);
    const [canResend, setCanResend] = useState(true);

    const [
        register,
        { data: registerData, loading: registerLoading, error: registerError },
    ] = useMutation(REGISTER_USER);
    const [
        verifyAccount,
        { data: verifyData, loading: verifyLoading, error: verifyError },
    ] = useMutation(VERIFY_ACCOUNT);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register({ variables: formData })
            .then((response) => {
                if (response.data.register.success) {
                    setIsRegistered(true);
                }
            })
            .catch((err) => {
                console.error("Mutation error:", err);
            });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const { data } = await verifyAccount({ variables: { token: verificationToken } });
        if (data.verifyAccount.success) {
            onRegisterSuccess();
        }
    };

    const handleResend = async () => {
        try {
            await resendVerificationEmail({
                variables: { email: formData.email },
            });
            console.log("Verification email resent");
            setCanResend(false);
            setTimer(60); // 1 minute timer
        } catch (err) {
            console.error("Resend email error:", err);
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password1"
                    placeholder="Password"
                    value={formData.password1}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password2"
                    placeholder="Confirm Password"
                    value={formData.password2}
                    onChange={handleChange}
                />
                <button type="submit">Register</button>
            </form>
            {registerLoading && <p>Loading...</p>}
            {registerError && <p>Error: {registerError.message}</p>}
            {registerData && registerData.register.success && (
                <div className="register-results">
                    <p className="register-positive">
                        Registration successful! Please enter the verification
                        token sent to your email.
                    </p>
                    <form onSubmit={handleVerify} className="register-verify">
                        <input
                            type="text"
                            name="verificationToken"
                            placeholder="Verification Token"
                            value={verificationToken}
                            onChange={(e) =>
                                setVerificationToken(e.target.value)
                            }
                        />
                        <button type="submit">Verify Account</button>
                    </form>
                </div>
            )}
            {verifyLoading && <p>Verifying...</p>}
            {verifyError && <p>Error: {verifyError.message}</p>}
            {verifyData && verifyData.verifyAccount.success && (
                <p className="register-positive">
                    Account verified successfully!
                </p>
            )}
            {verifyData && verifyData.verifyAccount.errors && (
                <p className="register-negative">Invalid Token!!</p>
            )}
            {isRegistered && (
                <button
                    className="resend-button"
                    onClick={handleResend}
                    disabled={!canResend}
                >
                    Resend Email {timer > 0 && `(${timer}s)`}
                </button>
            )}
        </div>
    );
};

export default UserRegistration;
