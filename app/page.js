// Page.js is your main component for this project!

// make it a client-sided app 
'use client'

// import these
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Grid, useMediaQuery } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../../../project2REAL/inventory_management/firebase'

export default function Home() {
  // authentication state
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // authentication
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  // Async means it won't block our code while fetching
  const updateInventory = async () => {
    if (user) {
      const userInventoryRef = collection(firestore, 'users', user.uid, 'inventory');
      const snapshot = await getDocs(query(userInventoryRef));
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    }
  }

  const addItem = async (item) => {
    if (user) {
      const docRef = doc(firestore, 'users', user.uid, 'inventory', item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
    }
  }

  const removeItem = async (item) => {
    if (user) {
      const docRef = doc(firestore, 'users', user.uid, 'inventory', item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }

      await updateInventory();
    }
  }

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  if (!user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent='center'
        alignItems="center"
        gap={2}
        style={{
          background: 'linear-gradient(to left, #ef629f, #eecda3)',
          fontFamily: "'Roboto', sans-serif", // Apply a nice font
        }}
      >
        <Box>
          <Typography variant="h4" style={{ fontWeight: 'bold', color: '#ffffff' }}>
            Pantry Tracker
          </Typography>
        </Box>
        <Button
          onClick={handleGoogle}
          variant="contained"
          style={{ fontSize: '16px', padding: '10px 20px', backgroundColor: '#ff6f6f' }}
        >
          Sign in with Google
        </Button>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      style={{
        background: 'linear-gradient(to left, #ef629f, #eecda3)',
        fontFamily: "'Roboto', sans-serif", // Apply a nice font
      }}
    >
      <Box 
        width="100%" 
        height="80px" 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        padding={isMobile ? '10px' : '10px 20px'}
      >
        <Typography 
          variant='h5' 
          color='#ffffff' 
          style={{ fontSize: isMobile ? '16px' : '18px', backgroundColor: '#ff6f6f', padding: '5px 10px' }}
        >
          Inventory Items
        </Typography>

        <Button 
          onClick={handleSignOut} 
          variant="contained"
          style={{ fontSize: isMobile ? '16px' : '18px', padding: '10px 20px', backgroundColor: '#ff6f6f' }}
        >
          Sign out
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={isMobile ? '90%' : 400}
          bgcolor='#ff6f6f'
          border="2px solid #ffffff"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6" color="white">Add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button variant="outlined" 
              sx={{
                fontSize: '18px',
                padding: '10px 20px',
                backgroundColor: '#ff6f6f',
                color: '#ffffff',
                border: '5px solid white',
                '&:hover': {
                  backgroundColor: '#e55a5a', // A darker shade of the original color
                  borderColor: 'white', // Optional: change the border color on hover
                },
              }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{ fontSize: isMobile ? '16px' : '18px', padding: '10px 20px', backgroundColor: '#ff6f6f' }}
        >
          Add New Item
        </Button>
      </Box>
      <Box width="100%" padding={2}>
        <Grid container spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
              <Box
                width="100%"
                height="250px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                border='5px solid #ffffff'
                padding={2}
                color="#ffffff"
                textAlign="center"
              >
                <Typography 
                  variant="h4"
                  
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:'normal', 
                    width: '100%',
                    textAlign: 'center',
                    fontSize: {
                      xs: '16px', // Smallest font size for extra small screens
                      sm: '20px', // Small font size for small screens
                      md: '24px', // Medium font size for medium screens
                      lg: '28px', // Large font size for large screens
                    },
                  }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="#ffffff"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {`Quantity: ${quantity}`}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    style={{ fontSize: isMobile ? '14px' : '18px', padding: '10px 20px', backgroundColor: '#ff6f6f' }}
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    style={{ fontSize: isMobile ? '14px' : '18px', padding: '10px 5px', backgroundColor: '#ff6f6f' }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
