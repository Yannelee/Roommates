const axios = require('axios')
const fs = require('fs').promises
const {v4: uuidv4} = require('uuid')


const getRoommate = async () =>{
  const { data } = await axios.get('https://randomuser.me/api')
  const { name } = data.results[0]
  const roommate = {
    id: uuidv4().slice(30),
    nombre: `${name.first} ${name.last}`,
    debe: 0,
    recibe: 0
  }
  return roommate
}

const guardarRoommate = async (roommate) =>{
   const roommateJSON = await fs.readFile('roommates.json', 'utf8')
   const { roommates } = JSON.parse(roommateJSON)
  roommates.push(roommate)
  await fs.writeFile('roommates.json', JSON.stringify({roommates}, null, 2))
}

module.exports = {getRoommate, guardarRoommate}