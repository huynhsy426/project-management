require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI();

module.exports = {
    inputSearch: async (search) => {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: search }],
            model: "gpt-3.5-turbo-0613",
        });


        return completion.choices[0].message;
    }
};