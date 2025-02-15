
function partial() {
  let args = Array.prototype.slice.call(arguments);
  let fn = args.shift();
  return function() {
    let nextArgs = Array.prototype.slice.call(arguments);
    // replace null values with new arguments
    args.forEach(function(val, i) {
      if (val === null && nextArgs.length) {
        args[i] = nextArgs.shift();
      }
    });
    // if we have more supplied arguments than null values
    // then append to argument list
    if (nextArgs.length) {
      nextArgs.forEach(function(val) {
        args.push(val);
      });
    }
    return fn.apply(fn, args);
  }
}
function get_current_date() {
    const date = new Date();
    const month_names = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = month_names[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`
}

function get_current_time() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function current_datetime_to_key() {
    let key = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(Date.now());
    return key;
}

function key_to_datetime(key) {
    let date = null;
    let regex = /^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/;
    let match = key.match(regex);
    if (match) {
        let day = parseInt(match[1], 10);
        let month = parseInt(match[2], 10) - 1;
        let year = parseInt(match[3], 10);
        let hours = parseInt(match[4], 10);
        let minutes = parseInt(match[5], 10);
        let seconds = parseInt(match[6], 10);
        date = new Date(year, month, day, hours, minutes, seconds);
    }
    return date
}

function random_label() {
    let number = Math.floor(Math.random() * 1000);
    let label = number.toString().padStart(3, '0');
    return label;
}

function isObject(variable) {
    return typeof variable === 'object' && variable!== null && !Array.isArray(variable);
}

function get_tab_key(tab) {
    let key = tab.url;
    return key
}

const daylight_style = `
    input[type="checkbox"] {
        width: 24px;
        height: 24px;
        line-height:24px;
        border-radius: 4px;
        background-color: #fff;
        border: 2px solid #ccc;
    }

    input[type="checkbox"]:checked {
        background-color: #f1f1f1;
        border-color: #f1f1f1;
    }

    input[type="checkbox"]:checked::after {
        color: white;
        background-color: #f1f1f1;
        font-size: 16px;
        text-align: center;
        position: absolute;
        left: 4px;
        top: 0;
    }

    .button {
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        width: 25%;
        height: 28px;
        padding: 2px 2px;
        transition: 0.3s;
        font-size: 14px;
        border: 1px solid #ccc;
    }

    .button:hover {
        background-color: #ddd;
    }

    .button:disabled {
        background-color: #ccc;
    }

    .button.active {
        background-color: #ccc;
    }

    .tab {
        overflow: hidden;
        border: none;
        height: 30px;
        background-color: #f1f1f1;
    }
    .tab button {
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        width: 33%;
        height: 30px;
        padding: 2px 2px;
        transition: 0.3s;
        font-size: 14px;
    }

    .tab button:hover {
        background-color: #ddd;
    }

    .tab button.active {
        background-color: #ccc;
    }

    .tabcontent {
        display: none;
    }

    .tabhint {
        display: block;
        height: 60px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-top: none;
    }

    #assistant_output {
        display: block;
        position: absolute;
        width: calc(100% - 42px);
        height: calc(100% - 232px);
        top: 48px;
        align-items: top;
        padding: 6px 12px;
        border: 1px solid #ccc;
        overflow-y: scroll;
        z-index: 1000;
    }

    .assistant_output_block {
        display: block;
        width: calc(100% - 16px);
        height: auto;
        padding: 6px 6px;
        margin-bottom: 6px;
        border: 1px solid #ccc;
    }

    .assistant_output_title {
        display: flex;
        justify-content: space-between;
        width: calc(100% - 16px);
        height: auto;
        padding: 6px 6px;
        background-color: #f1f1f1;
    }

    .assistant_output_text {
        display: block;
        width: calc(100% - 16px);
        height: auto;
        padding: 6px 6px;
        margin-top: 6px;
        margin-bottom: 6px;
        overflow-wrap: word-break;
    }

    .assistant_output_paras {
        display: flex;
        width: calc(100% - 16px);
        height: auto;
        padding: 6px 6px;
        background-color: #f1f1f1;
    }

    .assistant_output_paras_key {
        background-color: #fff;
        width: 60px;
        font-size: 10px;
    }

    .assistant_output_paras_value {
        background-color: #fff;
        font-size: 10px;
    }

    .assistant_output_operations {
        display: flex;
        justify-content: end;
        gap: 2%;
        width: calc(100% - 16px);
        height: auto;
        padding: 6px 6px;
        background-color: #f1f1f1;
    }

    #assistant_input {
        display: block;
        position: absolute;
        width: calc(100% - 42px);
        height: 130px;
        top: calc(100% - 160px);
        padding: 6px 12px;
        border: 1px solid #ccc;
        z-index: 1000;
    }

    #assistant_input_text {
        display: block;
        position: absolute;
        width: calc(100% - 40px);
        max-width: calc(100% - 40px);
        overflow-wrap: break-word;
        height: 80px;
        padding: 6px 6px;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
    }

    #assistant_input_operations {
        display: flex;
        position: absolute;
        justify-content: space-between;
        width: calc(100% - 26px);
        height: 36px;
        top: calc(100% - 40px);
    }

    #personal_area {
        display: block;
        position: absolute;
        width: calc(100% - 42px);
        height: calc(100% - 150px);
        top: 120px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        overflow-y: scroll;
    }

    .personal_block {
        display: block;
        align: center;
        width: calc(100% - 14px);
        height: auto;
        padding: 6px 6px;
        margin-bottom: 6px;
        border: 1px solid #ccc;
    }

    .personal_row {
        display: flex;
        align-items: center;
        width: calc(100% - 8px);
        height: 24px;
        line-height: 24px;
        margin-bottom: 6px;
    }

    #settings_area {
        display: block;
        position: absolute;
        width: calc(100% - 42px);
        height: calc(100% - 150px);
        top: 120px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        overflow-y: scroll;
    }

    .setting_block {
        display: block;
        align: center;
        width: calc(100% - 14px);
        height: auto;
        padding: 6px 6px;
        margin-bottom: 6px;
        border: 1px solid #ccc;
    }

    .setting_row {
        display: flex;
        align-items: center;
        width: calc(100% - 8px);
        height: 24px;
        line-height: 24px;
        margin-bottom: 6px;
    }

`

function get_output_protocol() {
    let protocol = `
**Output Protocol**
- The goal is to assist users interacting with web pages.
- When the information in the webpage is given, you can summarize key points, translate content, write comments, or draft a reply based on the chat history

1. **Answer Format**: Your answer should directly respond to the user’s prompt (under the user_prompt section). Follow the instructions provided in the <instruction> section carefully—these are internal guidelines and should not be included in your response. Your answer should be clear, concise, and written in plain text. Avoid using XML or markdown tags unless specifically required.

2. **Answer Requirements**: Do not repeat any information before the "Start your answer:" instruction line. Never make up information. If something is unclear, mention the confusion directly. Provide useful, accurate, and actionable advice in your response.
`
    return protocol
}

function get_action_protocol() {
    let protocol = `
**Action Protocol**
- The goal is to provide action advice when user is interacting with web pages.
- When the information in the webpage is given, you will analysis the content of the webpage and suggest an action from the availabel actions, and specify the action name and action parameters according to the action's description.
- If none of the available actions should be perform, you should make no advice

1. **Action Description**: Describe the candidate action, including:
   - The **effect** of the action.
   - **When** to use the action (the hint for its application).
   - The **parameters** the action accepts.
   - How to clearly indicate the action’s usage in the advice.

2. **Answer Format**:
   - Provide **only one action advice** in the response.
   - The description of the action and parameters should be in **JSON format**.
   - The JSON should be enclosed in triple backticks (\`\`\`) with no extra labels like 'json', 'css', or 'data'.
   - Do **not** use triple backticks elsewhere in your answer.

3. **JSON Structure**:
   - 'action_name': A string representing the action's name.
   - 'action_paras': An object containing the parameters required for the action.

4. **Page Summary** :
   - this action will be performed automatically.
   - never involve 'Page Summary' in the advice.

**Example**:

\`\`\`json
{
    "action_name": "Page Summary",
    "action_paras": {
        "href": "https://github.com/aeromechanic000/procyon-web-assistant",
        "content": "The github page for the chrome extension procyon-web-assistant."
    }
}
\`\`\`
`
    return protocol
}

function get_page_info_instruction() {
    return `The content between <page_content> and </page_content> is the webpage the user is reading. Use this page information only when necessary to answer the user’s prompt. If it's not needed, ignore it. If you do use the page information, make sure it directly supports your answer.

- When user is communicating with you without requiring any task relevant to the webpage, DO NOT consider the content in the section of <page_content>.`;
}

function get_empty_page_instruction() {
    return `The webpage the user is reading provides little useful information, clearly remind the user that your answer is based on your internal knowledge, not the webpage content.`;
};

function get_error_page_instruction() {
    return `The content from the current web page cannot be extracted due to an issue.`;
};

function get_online_info_instruction() {
    return `The section between <online_content> and </online_content> contains information retrieved from the internet based on the user's prompt. Use this information only if it is necessary to build your answer; otherwise, ignore it.`;
};

function get_empty_online_instruction() {
    return `There is very little information from the internet relevant to the user's prompt. Make sure to include a reminder that your answer is based on your internal knowledge.`;
};

function get_error_online_instruction() {
    return `There was an issue retrieving online information.`;
};

function get_background_info_instruction(background) {
    let instruction = `Today's date is ${background["date"]}, and the time now is ${background["time"]}.`
    if (background["preferred_name"].length > 0) {
        instruction += `User prefers being called '${background["preferred_name"]}'`;
    }
    return instruction;
};

function rebuild_prompt_with_context(prompt, context) {
    let prompt_with_context = `\n<history>${context["chat_history"].join("\n")}</history>`;
    let instruction = get_background_info_instruction(context["background"]);
    if ("page_content" in context) {
        prompt_with_context += `\n <page_content>\n ${context["page_content"]} \n</page_content>`
        if ("page_instruction" in context) {
            instruction += context["page_instruction"] + "\n";
        }
    }

    if ("online_content" in context) {
        prompt_with_context += `\n <online_content>\n ${context["online_content"]} \n</online_content>`
        if ("online_instruction" in context) {
            instruction += context["online_instruction"] + "\n";
        }
    }

    prompt_with_context += `\n<principle_protocol>${get_output_protocol()}</principle_protocol>`;

    if (instruction.trim().length > 0) {
        prompt_with_context += `\n<instruction>\n ${instruction} \n</instruction>`
    }

    prompt_with_context += `\n <user_prompt>\n ${prompt} \n</user_prompt>\nStart your answer:\n`

    return prompt_with_context;
}

let ignore_action_hosts = ["chrome://", "chrome-extension://"];

function build_prompt_for_actions(prompt, context) {
    let prompt_for_actions = "";
    if ("page_info" in context && ignore_action_hosts.every(host => !context["page_info"]["href"].includes(host))) {
        let action_names = get_default_actions();

        if (action_names.length > 0) {
            if ("page_content" in context) {
                prompt_for_actions += `\n <page_content>\n ${context["page_content"]} \n</page_content>`
            }

            let instruction = "";
            let available_actions = "";
            for (let i = 0; i < action_names.length; i++) {
                let action_name = action_names[i];
                let action = action_list[action_name];
                available_actions += `## Action ${i + 1}\n ### Action Name\n ${action_name}\n ### Usage\n ${action["usage"]}\n ### Action Parameters\n`;
                for (let para in action["paras"]) {
                    available_actions += `- ${para} : ${action["paras"][para]}\n`;
                }
                available_actions += `### Examples\n ${action["examples"]}`
                if ("instruction" in action) {
                    instruction += action["instruction"];
                }
            }

            if ("reference" in context) {
                prompt_for_actions += `\n<reference>\n ${context["reference"]} \n</reference>`;
            }

            prompt_for_actions += `<principle_protocol>${get_action_protocol()}</principle_protocol>\n`;
            prompt_for_actions += `\n<available_actions>\n ${available_actions} \n</available_actions>`;

            if (instruction.trim().length > 0) {
                prompt_for_actions += `\n<instruction>\n ${instruction} \n</instruction>`;
            }

            prompt_for_actions += `\n<user_prompt>\n ${prompt} \n</user_prompt>\n Make your advice on next action:\n`;
        }
    }

    return prompt_for_actions;
}

function get_last_n_characters(str, n) {
    const index = Math.max(0, str.length - n);
    return str.slice(index);
}

function find_regex_positions(text, regex) {
    const positions = [];
    let match;
    while ((match = regex.exec(text))!== null) {
        positions.push(match.index);
    }
    return positions;
}

function split_content_and_json(text) {
    let content = text;
    let data = {};
    const mark_pos = [];
    const regex = /```/g;
    let match;

    while ((match = regex.exec(text))!== null) {
        mark_pos.push(match.index);
    }

    for (let i = 0; i < mark_pos.length - 1; i++) {
        const data_start = mark_pos[i];
        const data_end = mark_pos[i + 1];
        try {
            let json_text = text.slice(data_start + 3, data_end)
              .replace(/\n/g, "")
              .replace(/\r/g, "")
              .trim();
            const start = json_text.indexOf("{");
            if (json_text.length > 0 && json_text[0]!== "{" && start >= 0) {
                json_text = json_text.slice(start);
            }
            data = JSON.parse(json_text);
            content = (text.slice(0, data_start).trim() + "\n" + text.slice(Math.min(text.length, data_end + 3)).trim()).trim();
        } catch (e) {
            content = text;
            data = {};
        }
        if (isObject(data)) {
            break;
        }
    }
    return [content, data];
}

async function call_ollama_api(api_url, model, prompt) {
    let result = "";
    const data = {
        "model" : model,
        // "prompt" : get_last_n_characters(prompt, 4000),
        "prompt" : prompt,
        "options": {},
        "stream" : false,
    };
    const response = await fetch(api_url, {
        "method" : "POST",
        "headers": {'Content-Type': 'application/json'},
        "body": JSON.stringify(data),
    });
    if (!response.ok) {
        console.log("[call_ollama_api] Error in response:", response)
    } else {
        const response_data = await response.json();
        result = response_data.response;
    }
    return result;
}

async function call_doubao_api(model, prompt, token) {
    let result = "";
    let endpoint = "https://ark.cn-beijing.volces.com";
    let path = "api/v3/chat/completions"
    let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
    const data = {
        "model" : model,
        "messages" : [{
            "role" : "user",
            // "content" : get_last_n_characters(prompt, 10000),
            "content" : prompt,
        }],
        "stream" : false,
    };
    const response = await fetch(api_url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.log("[call_daobao_api] Error in response:", response);
    } else {
	    let response_json = await response.json();
        result = response_json.choices[0].message.content;
    }
    return result;
}

async function call_qwen_api(model, prompt, token) {
    let result = "";
    let endpoint = "https://dashscope.aliyuncs.com/";
    let path = "compatible-mode/v1/chat/completions"
    let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
    const data = {
        "model" : model,
        "messages" : [{
            "role" : "user",
            // "content" : get_last_n_characters(prompt, 50000),
            "content" : prompt,
        }],
        "stream" : false,
    };
    const response = await fetch(api_url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.log("[call_qwen_api] Error in response:", response);
    } else {
	    let response_json = await response.json();
        console.log("[call_qwen_api] response_json:", response_json);
        result = response_json.choices[0].message.content;
    }
    return result;
}

async function call_siliconflow_api(model, prompt, token) {
    let result = "";
    let endpoint = "https://api.siliconflow.cn/";
    let path = "v1/chat/completions"
    let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
    const data = {
        "model" : model,
        "messages" : [{
            "role" : "user",
            // "content" : get_last_n_characters(prompt, 50000),
            "content" : prompt,
        }],
        "stream" : false,
    };
    const response = await fetch(api_url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.log("[call_siliconflow_api] Error in response:", response);
    } else {
	    let response_json = await response.json();
        console.log("[call_siliconflow_api] response_json:", response_json);
        result = response_json.choices[0].message.content;
    }
    return result;
}

async function call_hf_api(model, prompt, token) {
    let result = "";
    const data = {
        // "inputs" : get_last_n_characters(prompt, 4000),
        "inputs" : prompt,
        "stream" : false,
    };

    let api_url = `https://api-inference.huggingface.co/models/${model}`;
    const response = await fetch(api_url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.log("[call_hf_api] Error in response:", response);
    } else {
	    let response_json = await response.json();
        result = response_json.generated_text;
    }
    return result;
}
