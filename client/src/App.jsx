import React, {useEffect, useMemo, useState} from 'react'
import { io } from 'socket.io-client';
import Landing from './components/Landing';
import {Container, TextField, Button} from  '@mui/material';

function App() {

  const socket =  useMemo(()=> io("http://localhost:3000"),[])
  const [message,setMessage]=useState("")
  const [room,setRoom]=useState("")
  const [socketID,setSocketID]=useState("")
  const [indmessage,setIndmessage]=useState([])

  const handleSubmit=(e)=>{
    e.preventDefault()
    socket.emit("message",{message,room})
    setMessage("")
    
  }


  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketID(socket.id)
      console.log("connected",socket.id)
    })

    socket.on("welcome",(s)=>{console.log(s)})

    socket.on("receive-message",(data)=>{
      console.log(data)
      setIndmessage((indmessage)=>[...indmessage,data])
    })

    return ()=>{
      socket.disconnect()
    }
  },[])



  return (
    <>
      <Container maxWidth="sm">
        <div>
          <div><h1>{socketID}</h1></div>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Message"
              variant="outlined"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Room"
              variant="outlined"
              value={room}
              onChange={(e)=>setRoom(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
          <stack>
            {
              indmessage.map((m,i)=>(
                <div>
                  <h6>{m}</h6>
                </div>
              ))
            }
          </stack>
        </div>
      </Container>
    </>
  )
}

export default App