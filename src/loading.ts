import type { Ora } from "ora";
import ora from "ora";

// 用于关闭动画
let spinner: Ora;

// 开启动画
function startLoading() {
    spinner = ora("Please wait for the answer...\r").start();
}

// 关闭动画
function stopLoading() {
    spinner.stop();
}

export { startLoading, stopLoading };