import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const UPLOAD_TRACK = gql`
    mutation UploadTrack(
        $title: String!
        $albumTitle: String!
        $file: String!
    ) {
        uploadTrack(title: $title, album_title: $albumTitle, file: $file) {
            track {
                id
                title
                album {
                    id
                    title
                }
                duration
                file
            }
        }
    }
`;

const GET_TRACKS = gql`
    query {
        allTracks {
            title
            duration
            file
        }
    }
`;

const UploadTrackForm = () => {
    const [formState, setFormState] = useState({
        title: "",
        albumTitle: "",
        file: null,
    });

    const [uploadTrack, { error }] = useMutation(UPLOAD_TRACK, {
        refetchQueries: [{ query: GET_TRACKS }],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setFormState({
                ...formState,
                file: reader.result.split(",")[1], // Get base64 string without the prefix
            });
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form with state:", formState);
        uploadTrack({ variables: { ...formState } })
            .then((response) => {
                console.log("Upload successful:", response);
            })
            .catch((err) => {
                console.error("Error uploading track:", err);
                if (
                    err.networkError &&
                    err.networkError.result &&
                    err.networkError.result.errors
                ) {
                    console.error(
                        "GraphQL errors:",
                        err.networkError.result.errors
                    );
                }
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Album Title:</label>
                <input
                    type="text"
                    name="albumTitle"
                    value={formState.albumTitle}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>File:</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <button type="submit">Upload Track</button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
};

export default UploadTrackForm;
