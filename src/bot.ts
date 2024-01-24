import { Configuration, OpenAIApi } from "openai";
import colors from "colors";
import { addChatBotMessage, messages } from "./message.js";

// 机器人对象
let openAIApi: OpenAIApi;

// 初始化机器人对象
function initializeChatBot() {
    openAIApi = new OpenAIApi(
        new Configuration({
            basePath: "https://api.chatanywhere.tech",
            // 从环境变量中读取key，但要先有环境变量
            apiKey: process.env.OPENAI_API_KEY
        })
    );
}

async function chatBotAnswer() {
    // 将消息传给ai，等待它返回答案
    const chatCompletion = await openAIApi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
    });
    // 获取答案
    const answer = chatCompletion.data.choices[0].message?.content as string;
    // 收集答案便于下次回答
    addChatBotMessage(answer);
    // 在控制台输出答案
    console.log(colors.bold.red(`Bot:`), colors.cyan(answer));
}

export { initializeChatBot, chatBotAnswer };