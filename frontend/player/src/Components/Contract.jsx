import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "../Styles/Contract.css";

// Define the GraphQL mutation
const CREATE_CONTRACT = gql`
    mutation CreateContract($artistId: ID!) {
        createContract(artistId: $artistId) {
            contract {
                id
                artist {
                    id
                    name
                }
                terms
                signedDate
            }
        }
    }
`;

const Contract = () => {
    const [artistId, setArtistId] = useState("");
    const [createContract, { data, loading, error }] =
        useMutation(CREATE_CONTRACT);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createContract({ variables: { artistId } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="contract-container">
            <h2>Create Contract</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Artist ID:</label>
                    <input
                        type="text"
                        value={artistId}
                        onChange={(e) => setArtistId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Contract"}
                </button>
            </form>
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <h3>Contract Created</h3>
                    <p>Contract ID: {data.createContract.contract.id}</p>
                    <p>
                        Artist Name: {data.createContract.contract.artist.name}
                    </p>
                    <p>Terms: {data.createContract.contract.terms}</p>
                    <p>
                        Signed Date:{" "}
                        {new Date(
                            data.createContract.contract.signedDate
                        ).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Contract;
