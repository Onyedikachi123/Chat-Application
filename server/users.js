const users = [];


const addUser = ({id, name, room}) => {
// removing all spaces and putting it to lowercase(change to ur taste later)

name = name.trim().toLowerCase();
room = room.trim().toLowerCase();


const existingUser = users.find((user) => user.room === room && user.name === name); // checking if there a user with the same name as the new user

if(!name || !room) return { error: 'Username and room are required.' };

if(existingUser) {
    return{ error: 'Username is taken'};
}

// And if the user doesnt exist just add a new user to the array

const user = { id, name, room };

users.push(user);

return { user };

}

   // Removing users from our earlier array
const removeUser = (id) => {
   const index = users.findIndex((user) => user.id === id);

   if(index !== -1) {
       return users.splice(index, 1)[0];
   }
}

const getUser = (id) => users.find((user) => users.id === id);  



const getUsersInRoom = (room) => users.filter((user) => users.room === room);


module.exports = { addUser, removeUser, getUser, getUsersInRoom };
