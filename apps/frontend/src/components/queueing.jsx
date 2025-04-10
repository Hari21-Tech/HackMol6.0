import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import database from '@hackmol/database';

const QueueingPage = () => {
  const [queueList, setQueueList] = useState([]);
  const [shopDetails, setShopDetails] = useState({
    totalCapacity: 0,
    currentOccupancy: 0,
    name: '',
    address: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchQueueData();
    fetchShopDetails();
  }, []);

  const fetchQueueData = async () => {
    setQueueList([
      { id: 1, name: 'John Doe', phone: '123-456-7890' },
      { id: 2, name: 'Jane Smith', phone: '098-765-4321' },
    ]);
  };

  const fetchShopDetails = async () => {
    const data = await database.shops.getShop('2');
    if (!data.success) {
      setShopDetails({
        totalCapacity: 50,
        currentOccupancy: 30,
        name: 'Sample Restaurant',
        address: '123 Main St',
      });
      return;
    }
    setShopDetails({
      totalCapacity: data.result.total_occupancy,
      currentOccupancy: data.result.current_occupancy,
      name: data.result.name,
      address: data.result.address,
    });
  };

  const handleEditShopDetails = () => {
    console.log('Edit shop details');
  };

  const handleEditQueue = () => {
    console.log('Edit queue');
    setOpenModal(true);
  };

  const handleAddToQueue = () => {
    if (newUser.name && newUser.phone) {
      const newId =
        queueList.length > 0 ? queueList[queueList.length - 1].id + 1 : 1;
      setQueueList([
        ...queueList,
        { id: newId, name: newUser.name, phone: newUser.phone },
      ]);
      setNewUser({ name: '', phone: '' });
      setOpenModal(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getQueueStats = () => {
    return {
      inStoreQueue: shopDetails.currentOccupancy,
      virtualQueue: queueList.length,
    };
  };

  const queueStats = getQueueStats();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Container className="max-w-7xl mx-auto">
        <Typography
          variant="h4"
          className="text-3xl font-bold mb-8 text-gray-800"
        >
          Queue Management
        </Typography>

        <Grid container spacing={6} className="mb-8">
          <Grid item xs={12} md={6}>
            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <Typography
                  variant="h6"
                  className="text-xl font-semibold mb-4 text-gray-700"
                >
                  Shop Details
                </Typography>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Total Capacity:</span>{' '}
                    {shopDetails.totalCapacity}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span>{' '}
                    {shopDetails.name}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{' '}
                    {shopDetails.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <Typography
                  variant="h6"
                  className="text-xl font-semibold mb-4 text-gray-700"
                >
                  Occupancy Details
                </Typography>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Current Occupancy:</span>{' '}
                    {shopDetails.currentOccupancy}
                  </p>
                  <p>
                    <span className="font-medium">Virtual Queue:</span>{' '}
                    {queueList.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper className="rounded-xl shadow-lg overflow-hidden mb-8">
          <Box className="p-6 bg-gray-50 flex justify-between items-center">
            <Typography
              variant="h6"
              className="text-xl font-semibold text-gray-700"
            >
              Virtual Queue
            </Typography>
            <Button
              variant="contained"
              onClick={handleEditQueue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Edit Queue
            </Button>
          </Box>
          <TableContainer>
            <Table className="min-w-full">
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="font-semibold text-gray-700">
                    #
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Name
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">
                    Phone Number
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queueList.map((person, index) => (
                  <TableRow key={person.id} className="hover:bg-gray-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          className="rounded-xl"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add to Virtual Queue
          </DialogTitle>
          <DialogContent className="pt-6">
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="mb-4"
            />
            <TextField
              margin="dense"
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions className="px-6 py-4">
            <Button
              onClick={handleCloseModal}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddToQueue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default QueueingPage;
