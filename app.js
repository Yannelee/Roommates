const express = require('express')
const app = express()
const fs = require('fs')
const {getRoommate, guardarRoommate} = require('./roommate.js')
const {nuevoGasto, guardarGasto, editGasto} = require('./gastos.js')
const send = require('./correo.js')

app.listen(3000, console.log('puerto 3000 abierto'))
app.use(express.json())

app.get("/", (req, res) => {
    try {
        res.sendFile(__dirname + "/index.html")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/roommate', async (req, res)=>{
    try{
        const roommate = await getRoommate()
        await guardarRoommate(roommate)
        res.send(roommate)
    }catch(error){
        res.status(500).send(error)
    }
})

app.get("/roommate", (req, res) => {
    try {        
        res.sendFile(__dirname + "/roommates.json")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/gastos', (req, res)=>{
    try {        
        res.sendFile(__dirname + '/gastos.json')
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/gasto', async (req, res)=>{
    try {
        const gasto = nuevoGasto(req)
        await guardarGasto(gasto)

        const {roommate, monto, descripcion} = req.body
        const roommateJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
        const roommates = roommateJSON.roommates
        const divGastos = monto/roommates.length
        roommates.map((r)=>{
            if (r.nombre == roommate) {
                r.recibe += (monto - divGastos)
            } else {
                r.debe += divGastos
            }
        })
        send(roommate, monto, descripcion) 
        //- añadiria "correos", al ingresar los roommates a traves de getRoommate, añadir correo y luego utilizar .map para capturarlos en la variable correos
        //- variable a utilizar en el archivo "correos.js"
        fs.writeFileSync('roommates.json', JSON.stringify({roommates}, null, 2))
        res.status(200).send('Gasto agregado con éxito') 
    } catch (error) {
        res.status(500).send(error)
    }

})    

app.put('/gasto', (req, res)=>{
    try {
        const {id} = req.query
        const gasto = editGasto(req)
        const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
        const gastos = gastosJSON.gastos

        const roommateJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
        const roommates = roommateJSON.roommates

        let diferencia = 0;
        
        gastosJSON.gastos = gastos.map((g)=> {
            if (g.id === id) {
                diferencia = - (g.monto - gasto.monto)
                return gasto           
            } else {
                return g
            }
        })
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON, null, 2))

        const divGastos = diferencia/roommates.length
        roommates.map((r)=>{
            r.nombre === gasto.roommate
            ? r.recibe += divGastos
            : r.debe += divGastos
        })
        fs.writeFileSync('roommates.json', JSON.stringify({roommates}, null, 2))

        res.send('Gasto modificado')
    } catch (error) {
        res.status(500).send(error)
    }
    
})

app.delete('/gasto', (req, res)=>{
    try {
        const {id} = req.query
        const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
        const gastos = gastosJSON.gastos
        const roommateJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
        const roommates = roommateJSON.roommates
    
        let diferencia = 0;
        let roommate = '';
        gastosJSON.gastos = gastos.map((g)=> {
            if (g.id === id) {
                diferencia = g.monto
                roommate = g.roommate
            }
        })
        gastosJSON.gastos = gastos.filter((g) => g.id !== id)
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON, null, 2))
    
        const divGastos = diferencia/roommates.length
        roommates.map((r)=>{
            r.nombre === roommate
            ? r.recibe -= divGastos *(roommates.length - 1)
            : r.debe -= divGastos
        })
        fs.writeFileSync('roommates.json', JSON.stringify({roommates}, null, 2))

        res.send('Gasto eliminado con éxito')
    } catch (error) {
        res.status(500).send(error)
    }
})