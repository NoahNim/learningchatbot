"use client"
import { TextField, Box, Stack, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {role: 'assistant', content: `Hi I'm the Meowtime support assistant, how can I help you?` }
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ...messages,
        {role: 'user', content: message }
      ])
    });
    const data = await response.json();
    setMessages([...messages, {role: 'assistant', content: data?.message}])
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      alignItems="center"
    >
      <Stack
        width="500px"
        height="500px"
      >
        <Stack 
          direction="column"
          spacing={2}
          flexGrow={1}
        >
        {
          messages.map(( message, index ) => {
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? "flex-start" : "flex-end"}
            >
              <Box
                bgcolor={message.role === 'assistant' ? "primary.main" : "secondary.main"}
                color="white"
                borderRadius={16}
                p={2}
              >
                {message?.content}
              </Box>
            </Box>
          } )
        }
        </Stack>
      </Stack>
      <Stack 
        direction="row"
        spacing={2}  
      >
        <TextField 
          label="Message" 
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Stack>
    </Box>
  );
}
