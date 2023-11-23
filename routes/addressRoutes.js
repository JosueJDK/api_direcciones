const express = require('express');
const router = express.Router();
const Address = require('../models').Address;

// Obtener todas las direcciones
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva dirección
router.post('/', async (req, res) => {
  const { latitude, longitude, addressName } = req.body;
  try {
    const newAddress = await Address.create({ latitude, longitude, addressName });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una dirección existente
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { latitude, longitude, addressName } = req.body;
  console.log(req.body)
  try {
    const address = await Address.findByPk(id);
    if (!address) throw new Error('Dirección no encontrada');
    address.latitude = latitude;
    address.longitude = longitude;
    address.addressName = addressName;
    await address.save();
    res.json(address);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Eliminar una dirección
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const address = await Address.findByPk(id);
    if (!address) throw new Error('Dirección no encontrada');
    await address.destroy();
    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;


