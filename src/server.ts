import express from 'express'; 

const app = express();

app.get('/', (req, res) => {
    return res.send('Typescript voando!');
})

app.listen(3000);
