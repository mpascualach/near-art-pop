import React, { useState, useEffect } from "react";
import ApiKeyModal from "../apikey-modal/ApiKeyModal.jsx";
import { Button, TextField, Grid, Card, CardMedia } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import "./App.css";
import testImage from "./assets/test-image.png";

const App = () => {
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const [apiKey, setApiKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (event) => {
    setPromptText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const apiKey = import.meta.env.VITE_REACT_APP_DALLE_API_KEY;
    const apiUrl = `https://api.openai.com/v1/images/generations`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt: promptText }),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("API data loaded: ", data);
        setLoading(false);
        setImageUrls(data.data.map((item) => item.url));
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleModalSubmit = (key) => {
    setApiKey(key);
    setModalOpen(false);
  };

  // Sample API response
  const sampleResponse = {
    created: 1688203383,
    data: [
      {
        url: testImage,
      },
    ],
  };

  const simulateApiResponse = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setImageUrls(sampleResponse.data.map((item) => item.url));
    }, 2000);
  };

  const handleTestApi = () => {
    simulateApiResponse();
  };

  useEffect(() => {
    simulateApiResponse();
  }, []);

  const restartForm = () => {
    setImageUrls([]);
  };

  return (
    <>
      <ApiKeyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      <div>
        <div className="testRunContainer">
          <Button className="testRunButton" onClick={handleTestApi}>
            Test run
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {loading ? (
            <div>Loading...</div>
          ) : imageUrls.length ? (
            <>
              <Card variant="outlined" sx={{ height: 600, width: 600 }}>
                <CardMedia
                  image={imageUrls[0]}
                  sx={{ height: 600, width: 600 }}
                  style={{ position: "relative" }}
                >
                  <Button
                    className="refreshButton"
                    onClick={() => restartForm()}
                  >
                    <RefreshIcon></RefreshIcon>
                  </Button>

                  <Button
                    className="signButton"
                    color="success"
                    variant="contained"
                  >
                    Sign as NFT
                  </Button>
                </CardMedia>
              </Card>
              {/* TODOS: */}
              {/* upon clicking on this image, let's sign it and upload it to the blockchain? */}
              {/* second button for regenerating this image with the same prompt */}
              {/* option to go back and prompt again */}
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* <label htmlFor="promptInput" style={{ marginBottom: "0.5rem" }}>
                Enter Prompt:
              </label> */}
              {/* <button type="submit">Submit</button> */}
              <TextField
                autoFocus
                margin="normal"
                id="prompt"
                label="Prompt"
                fullWidth
                value={promptText}
                onChange={handleInputChange}
              />
              <Button
                color="success"
                variant="contained"
                onClick={() => handleSubmit(promptText)}
              >
                Enter prompt
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default App;
