
const action_list = {
    "Page Summary" : {
        "usage" : "",
        "examples" : "",
        "paras" : {
            "href" : "String",
            "content" : "String",
        },
        "handler" : page_summary_handler,
        "dest" : "sidepanel",
    },
    "Highlight Keywords" : {
        "usage" : `
- Use this action only when the user specifically asks to highlight the keywords;`,
        "examples" : ``,
        "paras" : {
            "href" : "A JSON string of the url to the webpage.",
            "keywords" : "a JSON list of strings seleted from the section of 'page content', according to the section of 'reference'.",
        },
        "handler" : highlight_keywords_handler,
        "dest" : "tab",
    },
}

function get_default_actions() {
    let actions = ["Highlight Keywords", ];
    return actions;
}

async function call_llm_api(provider, model, prompt) {
    let result = "";
    try {
        let data = await chrome.storage.local.get(`${provider.toLowerCase()}_setting`)
        if (provider == "Ollama" && "ollama_setting" in data) {
            let endpoint = data["ollama_setting"]["endpoint"];
            let path = "/api/generate";
            api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
            result = call_ollama_api(api_url, model, prompt);
        } else if (provider == "Doubao" && "doubao_setting" in data) {
            let token = data["doubao_setting"]["token"];
            result = call_doubao_api(model, prompt, token);
        } else if (provider == "QWen" && "qwen_setting" in data) {
            console.log("Data:", data);
            let token = data["qwen_setting"]["token"];
            result = call_qwen_api(model, prompt, token);
        } else if (provider == "SiliconFlow" && "siliconflow_setting" in data) {
            let token = data["siliconflow_setting"]["token"];
            result = call_siliconflow_api(model, prompt, token);
        } else if (provider == "HF" && "hf_setting" in data) {
            let token = data["hf_setting"]["token"];
            result = call_hf_api(model, prompt, token);
        }
    } catch (error) {
        console.log("[call_llm_api] Error:", error);
    }
    return result;
}

async function page_summary_handler(paras, setting) {
    let prompt = `<page_info>\n${paras["content"]}\n</page_info>\nMake a short summary based on the page info:\n`;
    let provider = setting["provider"];
    let model = setting["model"];
    let result = await call_llm_api(provider, model, prompt);
    return result;
}

function highlight_keywords_func(paras) {
    let area = document.body;
    if (paras["href"].includes("discord.com/channels")) {
        area = document.querySelector("div[class*=chat_]");
    }
    for (let keyword of paras["keywords"]) {
        for (let tag of ["span"]) {
            for (let element of area.querySelectorAll(tag)) {
                if (element.children.length < 1) {
                    if (element.innerText.includes(keyword)) {
                        element.style.backgroundColor = "rgb(100, 100, 0)";
                    }
                }
            }
        }
    }
}

async function highlight_keywords_handler(paras, setting) {
    let result = {
        "func" : highlight_keywords_func,
        "paras" : paras,
    }
    return result;
}
