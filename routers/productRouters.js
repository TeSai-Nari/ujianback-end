const express = require ('express')
const {allProductControllers} = require ('./../controllers')

const router= express.Router()          // Untuk menentukan grup rute.

router.get('/getproduct', allProductControllers.getproduct)
router.post('/postproduct', allProductControllers.tambahproduct)              // Untuk upload / tambah product
router.delete('/deleteproduct/:id', allProductControllers.deleteproduct)      // Untuk hapus product
router.put('/editproduct/:id', allProductControllers.editproduct)
module.exports = router