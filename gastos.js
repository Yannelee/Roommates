const fs = require('fs').promises
const {v4: uuidv4} = require('uuid')

const nuevoGasto = (req) => {
  const id = uuidv4().slice(30)
  const {roommate, descripcion, monto} = req.body
  const gasto = {
      id: id, 
      roommate: roommate, 
      descripcion: descripcion,
      monto: monto
  }
  return gasto
}

const guardarGasto = async (gasto) =>{
  const gastoJSON = await fs.readFile('gastos.json', 'utf8')
  const { gastos } = JSON.parse(gastoJSON)
  gastos.push(gasto)
  await fs.writeFile('gastos.json', JSON.stringify({gastos}, null, 2))

}

const editGasto = (req)=>{
  const {id} = req.query
  const {roommate, descripcion, monto} = req.body
  const gasto = {
      id, 
      roommate, 
      descripcion, 
      monto
  }
  return gasto
}

module.exports = {nuevoGasto, guardarGasto, editGasto}