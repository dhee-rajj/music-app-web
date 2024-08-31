import React, { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import MusicList from "./Components/MusicList";
import SearchTrack from "./Components/SearchTrack";
import UserRegistration from "./Components/UserRegistration";
import UserLogin from "./Components/UserLogin";
import "./App.css";
import RaiseTicket from "./Components/RaiseTicket";

const client = new ApolloClient({
    uri: "http://127.0.0.1:8000/graphql/", // Update with your GraphQL endpoint
    cache: new InMemoryCache(),
});

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <ApolloProvider client={client}>
            <div className="App">
                {!isAuthenticated ? (
                    isRegistering ? (
                        <UserRegistration
                            onRegisterSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <UserLogin onLoginSuccess={handleLoginSuccess} />
                    )
                ) : (
                    <> 
                        <SearchTrack />
                        <h1>Music List</h1>
                        <MusicList></MusicList>
                        <h1>Raise Ticket</h1>
                        <RaiseTicket />
                    </>
                )}

                {!isAuthenticated && (
                    <div className="button-container">
                        <button onClick={toggleRegister}>
                            {isRegistering
                                ? "Already have an account? Login"
                                : "New user? Register"}
                        </button>
                    </div>
                )}
            </div>
        </ApolloProvider>
    );
};

export default App;
