const express = require ('express')
const {allInventoryControllers} = require ('./../controllers')

const router= express.Router()          

router.get('/getinventory', allInventoryControllers.getinventory)
// router.get('/editinventory', allInventoryControllers.editinventory)           
// router.post('/postinventory', allInventoryControllers.tambahinventory)        
router.delete('/deleteinventory/:id', allInventoryControllers.deleteinventory)      // Untuk hapus foto

module.exports = router