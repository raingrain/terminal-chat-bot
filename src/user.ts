import readlineSync from "readline-sync";
import colors from "colors";
import { addUserMessage } from "./message.js";

function askQuestion() {
    // 读取用户输入
    const userInput = readlineSync.question(colors.rainbow("You: "));
    // 将用户消息加入上下文环境
    addUserMessage(userInput);
    // 并返回
    return userInput;
}

export { askQuestion };