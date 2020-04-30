const {db} = require('./../connection/index')                   // bisa masuk index, bisa juga stop di connection-nya
const {uploader} = require('./../helper/uploader')
const fs = require('fs')

module.exports = {
    postfoto: (req,res)=>{                                       // untuk uploader perlu try, catch karena uploader tdk ada handling errornya
        try {                                                    // Path= Membuat folder di dalam folder public
            const path='/foto'// ini terserah                                // Krn mengenai foto, alamatnya bisa juga '/foto/image' (bebas)
            const upload = uploader(path,'TSUKI').fields([{ name: 'image' }])  // Masukkin uploader dr atas. Lihat uploader-nya. TSUKI = filenameprefix-nya
                                                                            // Param 1: masuk path-nya, Param 2: namadepan foto-nya.
                                                                            // Fields berkaitan dg F-E. Nanti dicocokkan dengan F-E
            upload(req,res,(err)=>{
                if(err) return res.status(500).json({message: 'Upload foto failed', error:err.message })
                console.log('lewat')                            // Pada tahap ini foto sudah ter-upload & masuk ke public, tapi blm simpan path di database-nya (sql)
                const { image }= req.files;                       // Taruh foto ke sql (database). Ingat ini destructuring
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null; // Baca: kalau imagenya ada, buat path. kalau tak, null
                console.log(imagePath)
                console.log(req.body.data)                      // Merp. data yang dikirim selain fotonya (cth: caption)(lanjut di bawah)
                const data = JSON.parse(req.body.data)          // Data tsb harus diubah ke JSON terlebih dahulu, baru bisa masukkin ke dlm fotonya
                console.log(data,'1')                           // Bisa tahu data-nya apa saja
                data.imagefoto=imagePath                        // imagefoto dari kolumn table 'photos' database hokijc12 dari workbench. Akan disimpan di sini
                console.log(data,2)
                var sql = `insert into foto set ?`     // photos dari workbench
                db.query(sql, data, (err,result) => {
                    if(err) {                                   // Kalau error, img akan kehapus( see day2 fs). Perlu dihapus supaya tidak nambah beban
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message});
                    }
                    console.log(result)
                    db.query(`select * from foto`,(err,result1)=>{ 
                        if(err) return res.status(500).send(err)
                        return res.status(200).send(result1)
                    })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    getfoto:(req,res)=>{
        db.query(`select * from foto`,(err,result1)=>{        // photos dari workbench
            if(err) return res.status(500).send(err)
            return res.status(200).send(result1)
        })
    },
    deletefoto:(req,res)=>{                                     // Kalau mau delete, cari dulu data yang mau dihapus ada / tidak
        const {id} = req.params                                 // Perlu id photo mana yang perlu di hapus (hrs tahu image path-nya di mana, img path digunakan u/hapus foto)
        var sql= `select * from foto where id=${id}`          // Select all blablabla Secara otomatis bentuk = array of obj
        db.query(sql, (err,result)=>{
            if(err) return res.status(500).send(err)            // Makanya bisa pakai length  
            if(result.length){                                  // Baca: Jika datanya ada (lengthnya = 1)...
                var sqldel=`delete from foto where id=${id}`  // Delete databasenya, baru delete fotonya(menurut kebijakan msg-msg)
                db.query(sqldel,(err,result1)=>{
                    if(err) return res.status(500).send(err)    // Makanya bisa pakai length  
                    if(result[0].imagefoto){                    // Kalau ada imagenya, dihapus
                        fs.unlinkSync('./public' + result[0].imagefoto);
                    }
                    db.query('select * from foto',(err2,result2)=>{ // Kalau tak ada, lewat sini (select * from foto lagi)
                        if(err2) return res.status(500).send(err2)
                        return res.status(200).send(result2)
                    })                                                  
                })
            }else{                                                    // Kalau tak ada gambarnya dibuat error
                return res.status(500).send({message: 'tak ada id gambarnya'})
            }      
        })
    },
    editfoto:(req,res)=>{                                             // Logika: masukkan foto baru, yang lama dihapus. Imagepathnya diupdate, sedangkan yg lama dihapus
        const {id}=req.params                                         // Tetap perlu id untuk tahu edit foto yang mana
        var sql=`select * from foto where id=${id}`
        db.query(sql,(err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length){                                        // Jika ada id yang dipilih, maka diupload dulu (pakai try catch, dan cara sama kayak upload di atas)
                try{
                    const path='/foto'                                
                    const upload = uploader(path,'TSUKI').fields([{name:'image'}])
                    upload(req,res,(err)=>{
                        if(err){
                            return res.status(500).JSON({message:'Upload post picture failed!', error:err.message})
                        }
                        console.log('lewat')                          // Pada tahap ini foto sudah ter-upload & masuk ke public, tapi blm simpan path di database-nya (sql)
                        const {image}= req.files;
                        const imagePath = image ? path + '/' + image[0].filename : null // Baca: kalau imagenya ada, buat...
                        console.log(imagePath)
                        console.log(req.body.data)                      // Merp. data yang dikirim selain fotonya (cth: caption)(lanjut di bawah)
                        const data = JSON.parse(req.body.data)          // Data tsb harus diubah ke JSON terlebih dahulu, baru bisa masukkin ke dlm fotonya
                        if(imagePath){                                  // if imagePath-nya ada
                            data.imagefoto=imagePath                    // imagefoto dari kolumn table 'photos' database hokijc12 dari workbench. Akan disimpan di sini
                        }
                        sql=`update foto set ? where id=${id}`
                        db.query(sql,data,(err1,result1)=>{
                            if(err1){
                                if(imagePath){                          // Jika query nya error, dan imagePathnya ada. Maka dihapus foto yg sudah ke-upload.      
                                    fs.unlinkSync('./pulic' + imagePath)                        // imagefoto dari kolumn table 'photos' database hokijc12 dari workbench. Akan disimpan di sini
                                }
                                return res.status(500).json({message: "There's an error on the server. Please contact the administrator.", error: err.message})
                            }
                            if(imagePath){                              // Hapus foto lama. Jika imagepath(fotobaru)-nya ada(true)
                                if(result[0].imagefoto){                // Dan jika imagefoto(lama)nya ada, maka di hapus foto yg lama
                                    fs.unlinkSync('./public' + result[0].imagefoto);
                                }
                            }
                            db.query('select * from foto',(err,result2)=>{ // Kalau tak ada, lewat sini (select * from foto lagi)
                                if(err) return res.status(500).send(err)
                                return res.status(200).send(result2)
                            })      
                        })
                    })
                }catch(error){
                    return res.status(500).send(error)
                }
            }
        })
    }
}
// ke Index.js Controllers

//json.parse: mengubah json jadi objek javascript
// Harusnya untuk delete, pakai yang namanya sql transaction. Kalau terjadi error gambarnya tak kehapus dulu (kembali ke kondisi awal)
// Kalau tak pakai sql transaction (pakai cara bebas) Kalau klik delete, error, perbaiki, refresh, gambarnya sudah hilang 