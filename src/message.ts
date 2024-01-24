// 因为大语言模型需要上下文环境来给出答案，我们需要将所有提问和回答的信息传过去才行，所以我们要保存所有对话成一个数组
const messages: {
    role: "user" | "assistant",
    content: string
}[] = [];

// 添加消息
function addMessage(role: "user" | "assistant", content: string) {
    messages.push({
        role,
        content
    });
}

// 添加用户输入
function addUserMessage(message: string) {
    addMessage("user", message);
}

// 添加机器人回答
function addChatBotMessage(message: string) {
    addMessage("assistant", message);
}

export { messages, addUserMessage, addChatBotMessage };
