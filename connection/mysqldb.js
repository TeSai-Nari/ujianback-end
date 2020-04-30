const mysql = require ('mysql') ;                       // Menghubungkan node.js ke mysql (data dr mysql bisa didapatkan)
const db    = mysql.createConnection({                  // Menyambungkan dg mysql.createConnection (obj)
    host    :'localhost',                               // Isi sesuai data mysql workbench
    user    :'tesai',
    password:'Jesusnumber1!',
    database:'ujianbackend',                                // Pilih database
    port    :'3306'
/*^*///multipleStatements: true                         // bisa true / false, berfungsi u/ membuat lbh dari 1 query
})

db.connect ((err) => {
    if(err) return console.log(err)                     // Kalau if hanya 1 baris, bisa dipersingkat tak usah pakai {}
    console.log('berhasil sudah')                       // Di tahap ini, masuk ke teriminal--> nodemon .
})

module.exports= db