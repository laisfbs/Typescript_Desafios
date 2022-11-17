/*
Exercise1:
	Dados o código abaixo, defina uma interface "User" e use-a de acordo.
*/
interface UserInterface{
    name: string;
    age: number;
    occupation: string;
}

export type User = unknown;

export const user: UserInterface[] = [
    {
        name: 'Max Mustermann',
        age: 25,
        occupation: 'Cooker'
    },
    {
        name: 'Kate Müller',
        age: 23,
        occupation: 'Astronaut'
    }
];

export function logPerson(user: UserInterface) {
    console.log(` - ${user.name}, ${user.age}`);
}

console.log('Users:');
user.forEach(logPerson);