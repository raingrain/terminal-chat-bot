#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import readlineSync from 'readline-sync';
import colors from 'colors';
import { OpenAIApi, Configuration } from 'openai';
import ora from 'ora';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// 因为大语言模型需要上下文环境来给出答案，我们需要将所有提问和回答的信息传过去才行，所以我们要保存所有对话成一个数组
const messages = [];
// 添加消息
function addMessage(role, content) {
    messages.push({
        role,
        content
    });
}
// 添加用户输入
function addUserMessage(message) {
    addMessage("user", message);
}
// 添加机器人回答
function addChatBotMessage(message) {
    addMessage("assistant", message);
}

function askQuestion() {
    // 读取用户输入
    const userInput = readlineSync.question(colors.yellow("You: "));
    // 将用户消息加入上下文环境
    addUserMessage(userInput);
    // 并返回
    return userInput;
}

// 机器人对象
let openAIApi;
// 初始化机器人对象
function initializeChatBot() {
    openAIApi = new OpenAIApi(new Configuration({
        basePath: "https://api.chatanywhere.tech",
        // 从环境变量中读取key，但要先有环境变量
        apiKey: process.env.OPENAI_API_KEY
    }));
}
function chatBotAnswer() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 将消息传给ai，等待它返回答案
        const chatCompletion = yield openAIApi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
        });
        // 获取答案
        const answer = (_a = chatCompletion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
        // 收集答案便于下次回答
        addChatBotMessage(answer);
        // 在控制台输出答案
        console.log(colors.bold.red(`Bot:`), colors.cyan(answer));
    });
}

// 用于关闭动画
let spinner;
// 开启动画
function startLoading() {
    spinner = ora("Please wait for the answer...\r").start();
}
// 关闭动画
function stopLoading() {
    spinner.stop();
}

// 初始化环境变量
dotenv.config({
    // 使用绝对路径
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env")
});
// 使用OPENAI_API_KEY初始化机器人
initializeChatBot();
// 根据用户的输入检查是否需要退出
function checkExit(userInput) {
    if (userInput.toLowerCase() === "exit") {
        // 退出进程
        process.exit();
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        // 用户输入问题
        const userInput = askQuestion();
        // 检查是否退出，是就结束
        checkExit(userInput);
        // 开启加载动画
        startLoading();
        // 等待机器人回答
        yield chatBotAnswer();
        // 机器人回答后结束加载动画
        stopLoading();
    }
}))();
