// Utility function to show Success, Info or Error message

const SUCCESS = "success";
const INFO_LIGHT = "info-light";
const INFO_DARK = "info-dark";
const ERROR = "error";

function getShowMsg(infoErrorMsg) {
    if (!infoErrorMsg || !(infoErrorMsg instanceof HTMLElement)) {
        throw new Error("Invalid element passed to getShowMsg");
    }

    let timeoutId = null;

    return (message, type = ERROR, timeout = 7000) => {

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        infoErrorMsg.classList.remove("hidden", "text-green-500", "text-red-500", "text-cyan-50", "text-cyan-950");
        
        if (type === SUCCESS) {
            infoErrorMsg.classList.add("text-green-500");
        } else if (type === INFO) {
            infoErrorMsg.classList.add("text-cyan-50");
        } else if (type === INFOD) {
            infoErrorMsg.classList.add("text-cyan-950");
        } else if (type === ERROR) {
            infoErrorMsg.classList.add("text-red-500");
        }
        else throw new Error(`Invalid type: "${type}"`);
        infoErrorMsg.textContent = message;
    
        // Auto-clears msg
        if (!timeout) return;
        timeoutId = setTimeout(() => {
            infoErrorMsg.classList.add("hidden");
            timeoutId = null;
        }, timeout);
    }
}
