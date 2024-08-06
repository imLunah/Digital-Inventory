'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, deleteDoc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')) // Creates a query to fetch documents from the inventory collection in Firestore.
    const docs = await getDocs(snapshot)  // Executes the query to get the documents.
    const inventoryList = [] // An array to hold the inventory data.

    docs.forEach((doc) => { //  It iterates over each document fetched and pushes an object containing the document's ID (doc.id) and data (doc.data()).
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList) // Updates the inventory state with the fetched data.
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      flexDirection="column"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(#e66465, #9198e5)",
      }}
      gap={2}>


      <Typography variant="h1" mb={10}> Digital Inventory </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
          width={400} bgcolor="white"
          border="2px solid #0000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}>

          <Typography variant="h6"> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}>

            </TextField>
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}> Click Me </Button>

          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => {
        handleOpen()
      }}> Add New Item </Button>

      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" alignItems="center" justifyContent="center" display="flex">
          <Typography variant="h2" color="#333"> Inventory Items </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                p={5}>

                <Typography variant="h3" color="#333" textAlign="center" > {name.charAt(0).toUpperCase() + name.slice(1)} </Typography>
                <Typography variant="h3" color="#333" textAlign="center" > {quantity} </Typography>
                <Stack direction="row" spacing={2}>

                  <Button variant="contained" onClick={() => {
                    addItem(name)
                  }}

                  > Add </Button>

                  <Button variant="contained" onClick={() => {
                    removeItem(name)
                  }}

                  > Remove </Button>
                </Stack>

              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  )
}