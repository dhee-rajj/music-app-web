import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "../Styles/RaiseTicket.css";

const CREATE_TICKET_MUTATION = gql`
    mutation CreateTicket(
        $issue: String!
        $username: String!
        $password: String!
    ) {
        tokenAuth(username: $username, password: $password) {
            success
            errors
        }
        createTicket(issue: $issue) {
            ticket {
                id
                issue
                user {
                    id
                    username
                }
            }
        }
    }
`;

const RaiseTicket = () => {
    const [issue, setIssue] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [createTicket, { data, loading, error }] = useMutation(
        CREATE_TICKET_MUTATION
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                variables: { issue, username, password },
            });
            alert("Ticket created successfully");
            setIssue("");
            setUsername("");
            setPassword("");
        } catch (err) {
            console.error(err);
            alert("Error creating ticket");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe your issue"
                required
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Raise Ticket</button>
        </form>
    );
};

export default RaiseTicket;
