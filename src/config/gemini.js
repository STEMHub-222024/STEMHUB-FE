import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'react-toastify';

const apiKey = process.env.REACT_APP_STEAM_GEMINI_AI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

// const generationConfig = {
//     temperature: 0.7,
//     topP: 0.9,
//     topK: 50,
//     maxOutputTokens: 1000,
//     responseMimeType: 'text/plain',
// };

// const safetySettings = [
//     {
//         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//         threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//     },
//     {
//         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
//     {
//         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//     },
// ];

async function run(prompt, chatHistory = []) {
    try {
        let fullPrompt = `Bạn là một AI assistant. Hãy luôn trả lời bằng tiếng Việt một cách tự nhiên và dễ hiểu.\n\n`;
        
        if (chatHistory.length > 0) {
            fullPrompt += `Lịch sử trò chuyện:\n`;
            chatHistory.forEach(msg => {
                fullPrompt += `${msg.role === 'assistant' ? 'Assistant' : 'Human'}: ${msg.message}\n`;
            });
            fullPrompt += `\n`;
        }

        fullPrompt += `Human: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
    }
}

export default run;
