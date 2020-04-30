const express = require ('express')
const {allStoreControllers} = require ('./../controllers')

const router= express.Router()          // Untuk menentukan grup rute.

router.get('/getstore', allStoreControllers.getstore)
router.post('/poststore', allStoreControllers.tambahstore)              // Untuk upload / tambah store
router.delete('/deletestore/:id', allStoreControllers.deletestore)      // Untuk hapus store
router.put('/editstore/:id', allStoreControllers.editstore)
module.exports = router