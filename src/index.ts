import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { askQuestion } from "./user.js";
import { chatBotAnswer, initializeChatBot } from "./bot.js";
import { startLoading, stopLoading } from "./loading.js";
// 初始化环境变量
dotenv.config({
    // 使用绝对路径
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env")
});

// 使用OPENAI_API_KEY初始化机器人
initializeChatBot();

// 根据用户的输入检查是否需要退出
function checkExit(userInput: string) {
    if (userInput.toLowerCase() === "exit") {
        // 退出进程
        process.exit();
    }
}

(async () => {
    while (true) {
        // 用户输入问题
        const userInput = askQuestion();
        // 检查是否退出，是就结束
        checkExit(userInput);
        // 开启加载动画
        startLoading();
        // 等待机器人回答
        await chatBotAnswer();
        // 机器人回答后结束加载动画
        stopLoading();
    }
})();