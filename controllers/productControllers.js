const {db} = require('./../connection')
const {uploader} =require('./../helper/uploader')
const {fs}=require('fs')
module.exports = {
    getproduct: (req,res) => {
        /*^*/db.query('select * from product',(err,result)=>{
            if(err) return res.status(500).send(err)            
            return res.status(200).send(result)
        })           
    },
    tambahproduct: (req,res) =>{
        try{
            const path='/public'                               
            const upload = uploader(path,'PRODIMG').fields([{ name: 'image' }])                                                             
            upload(req,res,(err)=>{
                if(err) return res.status(500).json({message: 'Error uploading foto', error:err.message })
                console.log('lewat')                           
                const {image}= req.files;                       
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null; 
                const data = JSON.parse(req.body.data)          
                console.log(data,'1')                           
                data.imagefoto=imagePath                       
                var sql = `insert into product set ?`     
                db.query(sql, data, (err,result) => {
                    if(err) {                                   
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message});
                    }
                    console.log(result)
                    db.query(`select * from product`,(err,result1)=>{ 
                        if(err) return res.status(500).send(err)
                        return res.status(200).send(result1)
                    })
            })
        })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    editproduct: (req,res) => {
        const {id}=req.params
        var sql=`select * from product where product_id=${id}`
        db.query(sql, (err,result)=>{
            if(err) res.status(500).send(err)
            if(result.length) {
                try {
                    const path='/public'
                    const upload=uploader(path, 'PRODIMG').fields([{name: 'image'}])
                    upload (req, res, (err)=>{
                        if(err) {
                            return res.status(500).json({message: 'Upload Post Picture Failed !', error: err.message});        
                        }
                        const { image } = req.files
                        const imagePath = image ? path + '/' + image[0].filename : null
                        const data = JSON.parse(req.body.data)
                        if(imagePath) {
                            data.imagePath=imagePath
                        }
                        sql = `Update product set ? where product_id = ${id}`
                        db.query(sql,data,(err1,result1)=>{
                            if(err1) {
                                if(imagePath) {
                                    fs.unlinkSync('./public' + imagePath)
                                }
                                return res.status(500).json({message:"There's an error on the server", error: err1.message})
                            }
                            if(imagePath) {
                                if(result[0].imagePath) {
                                    fs.unlinkSync('./public' + result[0].imagePath)
                                }
                            }
                            sql=`select * from products`
                            db.query(sql, (err1, result3)=>{
                                if(err1) return res.status(500).send(err1)
                                return res.status(200).send(result3)
                            })
                        })
                    })
                } catch (error) {
                    return res.status(500).send(error)            
                }
            }else{
                return res.status(500).send({message:'id tidak ditemukan'})
            }
        })
    },
    deleteproduct: (req,res) =>{
        const {id}=req.params//req.params.id
        var sql=`select * from product where product_id=${id}`
        db.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            var sql='select * from product'
            db.query(sql,(err,result2)=>{
                if (err) res.status(500).send(err)
                res.send(result2[0])
            })
        })
    }
}