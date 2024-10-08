import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const currencyClient = new Freecurrencyapi(process.env.CURRENCY_API_KEY);

app.get('/api/currency', async (req, res) => {
    const { from, to, amount } = req.query;
    
    try {
        const response = await currencyClient.latest({
            base_currency: from,
            currencies: to,
        });

        const rate = response.data[to];

        if (!rate) {
            return res.status(400).send('Invalid currency');
        }

        const convertedAmount = (amount * rate).toFixed(2);
        const conversion = {
            date: new Date().toISOString(),
            from,
            to,
            amount,
            convertedAmount,
        };
        res.json(conversion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error converting currency');
    }
});

app.get('/', (req, res) => {
    res.send("Running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
