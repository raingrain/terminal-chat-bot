import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import addShebang from "rollup-plugin-add-shebang";

export default defineConfig({
    // 打包入口
    input: "./src/index.ts",
    // 打包文件输出
    output: {
        file: "./dist/bundler.js",
        // 格式为esm，同时去tsconfig中修改"module"为"NodeNext"
        format: "esm"
    },
    plugins: [
        // 使rollup识别出ts
        typescript(),
        // 给打包的js文件添加行头，使其能够使用node进行执行
        addShebang({include: "./dist/bundler.js"})
    ]
});
