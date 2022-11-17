/*
Exercise10:

Não queremos reimplementar todas as solicitações de dados
     funções. Vamos decorar o antigo baseado em callback
     funções com o novo resultado compatível com Promise.
     A função final deve retornar uma Promise que
     resolveria com os dados finais diretamente
     (ou seja, usuários ou administradores) ou rejeitaria com um erro
     (ou digite Erro).

     A função deve ser nomeada promisify.

Exercício bônus de maior dificuldade:

     Crie uma função promisifyAll que aceite um objeto
     com funções e retorna um novo objeto onde cada um
     a função é prometida.

     Reescreva a criação da API de acordo:

         const api = promisifyAll(oldApi);
         
*/
interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'Actor' }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Cooker' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' }
];

export type ApiResponse<T> = (
    {
        status: 'success';
        data: T;
    } |
    {
        status: 'error';
        error: string;
    }
);

export type PromiseFunction<T> = () => Promise<T>;

export type CallbackFunction<T> = (callback: (response: ApiResponse<T>) => void) => void;

export function promisify<T>(arg: CallbackFunction<T>): PromiseFunction<T> {
    return () => new Promise<T>((resolve, reject) => {
        arg((response) => {
            if(response.status === 'success'){
                resolve(response.data)
            }else{
                reject(new Error(response.error))
            }
        })
    })
}

const oldApi = {
    requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
        callback({
            status: 'success',
            data: admins
        });
    },
    requestUsers(callback: (response: ApiResponse<User[]>) => void) {
        callback({
            status: 'success',
            data: users
        });
    },
    requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
        callback({
            status: 'success',
            data: Date.now()
        });
    },
    requestCoffeeMachineQueueLength(callback: (response: ApiResponse<string>) => void) {
        callback({
            status: 'error',
            error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
        });
    }
};

export const api = {

    requestAdmins: promisify(oldApi.requestAdmins),

    requestUsers: promisify(oldApi.requestUsers),

    requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),

    requestCoffeeMachineQueueLength: promisify(oldApi.requestCoffeeMachineQueueLength)

};

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

async function startTheApp() {
    console.log('Admins:');
    (await api.requestAdmins()).forEach(logPerson);
    console.log();

    console.log('Users:');
    (await api.requestUsers()).forEach(logPerson);
    console.log();

    console.log('Server time:');
    console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`);
    console.log();

    console.log('Coffee machine queue length:');
    console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}

startTheApp().then(
    () => {
        console.log('Success!');
    },
    (e: Error) => {
        console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`);
    }
);