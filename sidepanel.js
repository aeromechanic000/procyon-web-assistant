
const assistant_output = document.getElementById("assistant_output");
const assistant_input_text = document.getElementById("assistant_input_text");
const assistant_input_send = document.getElementById("assistant_input_send");
const assistant_input_online = document.getElementById("assistant_input_online");
const assistant_setting_provider_select = document.getElementById("assistant_setting_provider");
const assistant_setting_model_select = document.getElementById("assistant_setting_model");
const assistant_setting_active_input = document.getElementById("assistant_setting_active");
const assistant_setting_memory_input = document.getElementById("assistant_setting_memory");
const assistant_setting_theme_select = document.getElementById("assistant_setting_theme");
const personalization_setting_preferred_name_input = document.getElementById("personalization_setting_preferred_name");
const personalization_setting_assistant_name_input = document.getElementById("personalization_setting_assistant_name");
const ollama_setting_block = document.getElementById("ollama_setting_block");
const chatgpt_setting_block = document.getElementById("chatgpt_setting_block");
const claude_setting_block = document.getElementById("claude_setting_block");
const qwen_setting_block = document.getElementById("qwen_setting_block");
const siliconflow_setting_block = document.getElementById("siliconflow_setting_block");
const chatgpt_setting_token_input = document.getElementById("chatgpt_setting_token");
const claude_setting_token_input = document.getElementById("claude_setting_token");
const qwen_setting_token_input = document.getElementById("qwen_setting_token");
const siliconflow_setting_token_input = document.getElementById("siliconflow_setting_token");
const ollama_setting_endpoint_input = document.getElementById("ollama_setting_endpoint");

let assistant_history_blocks = {};
let provider_services = {};
let assistant_output_generating = false;


document.getElementById('assistant_bt').addEventListener('click', function() {
    activate_tab("assistant");
});

document.getElementById('personal_bt').addEventListener('click', function() {
    activate_tab("personal");
});

document.getElementById('settings_bt').addEventListener('click', function() {
    activate_tab("settings");
});

document.getElementById('assistant_input_text').addEventListener('input', function() {
});

document.getElementById('assistant_input_online').addEventListener('change', function() {
});

document.getElementById('save_assistant_setting').addEventListener('click', function() {
    assistant_data["assistant_setting"]["provider"] = assistant_setting_provider_select.options[assistant_setting_provider_select.selectedIndex].text;
    assistant_data["assistant_setting"]["model"] = assistant_setting_model_select.options[assistant_setting_model_select.selectedIndex].text;
    assistant_data["assistant_setting"]["active_assistant"] = assistant_setting_active_input.checked;

    chrome.storage.local.set({"assistant_setting": assistant_data["assistant_setting"]}, () => {
      if (chrome.runtime.lastError) {
        console.log("Error setting data:", chrome.runtime.lastError);
      } else {
        console.log('Data saved successfully!');
      }
    });

    update_sidepanel_theme();
});

document.getElementById('save_personalization_setting').addEventListener('click', function() {
    assistant_data["personalization_setting"]["preferred_name"] = personalization_setting_preferred_name_input.value;
    assistant_data["personalization_setting"]["assistant_name"] = personalization_setting_assistant_name_input.value;

    chrome.storage.local.set({"personalization_setting": assistant_data["personalization_setting"]}, () => {
      if (chrome.runtime.lastError) {
        console.log("Error setting data:", chrome.runtime.lastError);
      }
    });
});

document.getElementById('assistant_setting_provider').addEventListener('change', function() {
    assistant_setting_model_select.innerHTML = "";
    try {
        let provider = assistant_setting_provider_select.options[assistant_setting_provider_select.selectedIndex].text;
        if (provider in provider_services) {
            for (let key in provider_services[provider]["models"]) {
                let model = provider_services[provider]["models"][key];
                if (["bert"].includes(model["details"]["family"])) {
                } else {
                    let model_option = document.createElement("option");
                    model_option.innerText = model["model"];
                    assistant_setting_model_select.appendChild(model_option);
                }
            }
        }
    } catch (error) {
        console.log("[assistant_setting_provider change] Error in update models for selected provider.")
    }
});

document.getElementById('save_chatgpt_setting').addEventListener('click', function() {
    assistant_data["chatgpt_setting"]["token"] = chatgpt_setting_token_input.value;
    update_provider_services();
    chrome.storage.local.set({"chatgpt_setting": assistant_data["chatgpt_setting"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving ChatGPT settings:", chrome.runtime.lastError);
        }
    });
});

document.getElementById('save_claude_setting').addEventListener('click', function() {
    assistant_data["claude_setting"]["token"] = claude_setting_token_input.value;
    update_provider_services();
    chrome.storage.local.set({"claude_setting": assistant_data["claude_setting"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving Claude settings:", chrome.runtime.lastError);
        }
    });
});

document.getElementById('save_qwen_setting').addEventListener('click', function() {
    assistant_data["qwen_setting"]["token"] = qwen_setting_token_input.value;
    update_provider_services();
    chrome.storage.local.set({"qwen_setting": assistant_data["qwen_setting"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving QWen settings:", chrome.runtime.lastError);
        }
    });
});

document.getElementById('save_siliconflow_setting').addEventListener('click', function() {
    assistant_data["siliconflow_setting"]["token"] = siliconflow_setting_token_input.value;
    update_provider_services();
    chrome.storage.local.set({"siliconflow_setting": assistant_data["siliconflow_setting"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving SiliconFlow settings:", chrome.runtime.lastError);
        }
    });
});

document.getElementById('save_ollama_setting').addEventListener('click', function() {
    assistant_data["ollama_setting"]["endpoint"] = ollama_setting_endpoint_input.value;
    update_provider_services();
    chrome.storage.local.set({"ollama_setting": assistant_data["ollama_setting"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error saving Ollama settings:", chrome.runtime.lastError);
        }
    });
});

document.getElementById('reset_assistant_setting').addEventListener('click', function() {
    let setting_keys = [
        "assistant_setting", "personalization_setting",
        "ollama_setting", "openai_setting", "claude_setting",
        "qwen_setting", "siliconflow_setting",
    ]

    chrome.storage.local.remove(setting_keys, () => {
        if (chrome.runtime.lastError) {
            console.log("Error setting data:", chrome.runtime.lastError);
        }
    });

    for (let i = 0; i < setting_keys.length; i++) {
        let key = setting_keys[i];
        assistant_data[key] =  JSON.parse(JSON.stringify(default_assistant_data[key]));
        chrome.storage.local.set({key : assistant_data[key]}, () => {
            if (chrome.runtime.lastError) {
                console.log("Error setting data:", chrome.runtime.lastError);
            }
        });
        init_settings();
    }
});

document.getElementById('clear_assistant_memory').addEventListener('click', function() {
    chrome.storage.local.remove("assistant_memory", () => {
        if (chrome.runtime.lastError) {
            console.log("Error setting data:", chrome.runtime.lastError);
        }
    });

    assistant_data["assistant_memory"] =  JSON.parse(JSON.stringify(default_assistant_data["assistant_memory"]));
    chrome.storage.local.set({"assistant_memory" : assistant_data["assistant_memory"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error in clearing assistant memory:", chrome.runtime.lastError);
        }
    });
    alert("All memory in assistant have been removed.")
});

document.getElementById('clear_assistant_history').addEventListener('click', function() {
    chrome.storage.local.remove("assistant_history", () => {
        if (chrome.runtime.lastError) {
            console.log("Error setting data:", chrome.runtime.lastError);
        }
    });

    assistant_data["assistant_history"] =  JSON.parse(JSON.stringify(default_assistant_data["assistant_history"]));
    assistant_output.innerHTML = "";
    assistant_history_blocks = {};
    chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error in clearing assistant history:", chrome.runtime.lastError);
        }
    });
    alert("All chat history in assistant have been removed.")
});

document.addEventListener('keydown', function (event) {
    if (!event.shiftKey && event.key === 'Enter') {
        if (document.activeElement === assistant_input_text && assistant_input_send.innerText == "Send") {
            event.preventDefault();
            assistant_input_send_clicked();
        }
    }
});

document.getElementById('assistant_input_send').addEventListener('click', function() {
    assistant_input_send_clicked();
});

function assistant_input_send_clicked() {
    if (assistant_input_send.innerText == "Send") {
        assistant_input_send.innerText = "Stop";

        let input = assistant_input_text.value;
        if (input.trim().length > 0) {
            let prompt = input;
            let [block, record] = add_assistant_output_block("text", "User");
            block.getElementsByClassName("assistant_output_text")[0].innerText = prompt;
            record["content"]["text"] = prompt;

            assistant_input_text.focus();
            assistant_input_text.blur();
            assistant_input_text.value = "";
            assistant_input_text.selectionStart = 0;
            assistant_input_text.selectionEnd = 0;
            assistant_input_text.focus();
            retrieve_page_information(prompt);
        }
    } else {
        assistant_output_generating = false;
    }
};

function retrieve_page_information(prompt, context = null) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.trim().length > 0 && !tabs[0].url.startsWith("chrome")) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ["content.js"],
            }, function (result) {
                console.log("[retrieve_page_information] result:", result)
                if (result) {
                    assistant_data["assistant_memory"]["page_buffer"] = result[0].result;
                    retrieve_online_information(prompt, context);
                } else {
                    assistant_data["assistant_memory"]["page_buffer"] = null;
                    retrieve_online_information(prompt, context);
                }
                console.log("[retrieve_page_information] Page buffer:", assistant_data["assistant_memory"]["page_buffer"])
                chrome.storage.local.set({"assistant_memory" : assistant_data["assistant_memory"]}, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error setting data:", chrome.runtime.lastError);
                    }
                });
            });
        } else {
            console.log("[retrieve_page_information chrome internal page]")
            retrieve_online_information(prompt, context);
        }
    });
}

function retrieve_online_information(prompt, context = null) {
    if (assistant_input_online.checked == true) {
        assistant_data["assistant_memory"]["online_search_prompt"] = prompt;
        assistant_data["assistant_memory"]["online_search_context"] = context;
        chrome.storage.local.set({"assistant_memory" : assistant_data["assistant_memory"]}, () => {
            if (chrome.runtime.lastError) {
                console.error("Error setting data:", chrome.runtime.lastError);
            }
        });

        let tab_id = assistant_data["assistant_memory"]["online_search_tab"];
        let query = prompt;
        chrome.tabs.query({}, function (tabs) {
            let tab = null;
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].id == tab_id) {
                    tab = tabs[i];
                    break;
                }
            }
            if (tab == null) {
                let current_tab_id = null;
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    current_tab_id = tabs[0].id;
                });
                chrome.tabs.create({"url": "https://www.google.com"}, function(tab) {
                    assistant_data["assistant_memory"]["online_search_tab"] = tab.id;
                    tab_id = assistant_data["assistant_memory"]["online_search_tab"];
                    if (current_tab_id != null) {
                        chrome.tabs.update(current_tab_id, {active: true});
                    }
                    chrome.search.query({text : query, tabId : tab_id});
                    chrome.storage.local.set({"assistant_memory" : assistant_data["assistant_memory"]}, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error setting data:", chrome.runtime.lastError);
                        }
                    });
                });
            } else {
                chrome.search.query({text : query, tabId : tab_id});
            }
        });
    } else {
        generate_assistant_output(prompt, context);
    }
}

function add_assistant_output_block(category, title = "Assistant", record = null) {
    if (record == null) {
        current_datetime = current_datetime_to_key();
        record = new_assistant_history_record(category)
        record["time"] = current_datetime;
        record["title"] = title;
        record["output_block"] = current_datetime + "-" + random_label();
        add_record_to_assistant_history(record);
    }

    var block = document.createElement('div');
    block.className = "assistant_output_block";

    if (!(record["output_block"] in assistant_history_blocks)) {
        // console.log("[add_assistant_output_blocks] Block:", record["output_block"])
        let block_title = document.createElement('div');
        block_title.className = "assistant_output_title";
        if (record["title"] == "Assistant" && assistant_data["personalization_setting"]["assistant_name"].length > 0) {
            block_title.innerHTML =  "<label>" + assistant_data["personalization_setting"]["assistant_name"] + "</label> <label>" + record["time"] + "</label>";
        } else if (record["title"] == "User") {
            block_title.innerHTML =  "<label> YOU </label> <label>" + record["time"] + "</label>";
        } else {
            block_title.innerHTML =  "<label>" + record["title"] + "</label> <label>" + record["time"] + "</label>";
        }
        block.appendChild(block_title);

        let block_text = document.createElement('div')
        block_text.className = "assistant_output_text";
        if (category == "text") {
            block_text.innerText = record["content"]["text"];
            block.appendChild(block_text);
        }

        let block_paras = document.createElement('div')
        block_paras.className = "assistant_output_paras";
        if (category == "action") {
            let block_table = document.createElement('table')
            block_table.style.width = "100%";
            for (let key of Object.keys(record["content"]["paras"]).sort()) {
                let paras_row = block_table.insertRow();
                paras_row.style.height = "24px";
                let paras_key = paras_row.insertCell();
                paras_key.className = "assistant_output_paras_key";
                paras_key.innerText = key;
                let paras_value = paras_row.insertCell();
                paras_value.className = "assistant_output_paras_value";
                let value = String(record["content"]["paras"][key]).trim().replace(/\n/g, "");
                if (key == "href") {
                    paras_value.innerText = value.slice(0, 36);
                } else {
                    paras_value.innerText = value.slice(0, 100);
                }
            }
            block_paras.appendChild(block_table);
            block.appendChild(block_paras);
        }

        let block_operations = document.createElement('div')
        block_operations.className = "assistant_output_operations";
        block.appendChild(block_operations);

        if (category == "text") {
            let block_copy_button = document.createElement('button')
            block_copy_button.className = "button"
            block_copy_button.style.width = "15%";
            block_copy_button.style.height = "20px";
            block_copy_button.style.fontSize = "10px";
            block_copy_button.innerHTML = "Copy";
            block_copy_button.onclick = partial(assistant_output_block_text_copy, block_text);
            block_operations.appendChild(block_copy_button);
        } else if (category == "action") {
            let block_name_label = document.createElement('label')
            block_name_label.style.width = "83%";
            block_name_label.style.height = "24px";
            block_name_label.style.fontSize = "12px";
            block_name_label.innerText = record["content"]["text"];
            block_operations.appendChild(block_name_label);
            let block_execute_button = document.createElement('button')
            block_execute_button.className = "button"
            block_execute_button.style.width = "15%";
            block_execute_button.style.height = "20px";
            block_execute_button.style.fontSize = "10px";
            block_execute_button.innerHTML = "Run";
            block_execute_button.onclick = partial(assistant_output_block_action_run, block_execute_button, record);
            block_operations.appendChild(block_execute_button);
        }
        assistant_history_blocks[record["output_block"]] = block;
    } else {
        block = assistant_history_blocks[record["output_block"]];
    }
    assistant_output.appendChild(block);
    assistant_output.scrollTop = assistant_output.scrollHeight;
    return [block, record];
}

function assistant_output_block_text_copy(block_text) {
    navigator.clipboard.writeText(block_text.innerText);
}

function assistant_output_block_action_run(button, record) {
    let action_name = record["content"]["text"];
    if (action_name in action_list) {
        let action = action_list[action_name];
        button.disabled = true;
        action["handler"](record["content"]["paras"], assistant_data["assistant_setting"])
        .then((result) => {
            console.log("[assistant_output_block_action_run] Result:", result)
            if (action["dest"] == "sidepanel") {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    new_record["content"]["text"] = result;
                    new_record["time"] = current_datetime_to_key();
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];
                    new_block_text.innerText = new_record["content"]["text"];
                    assistant_output.scrollTop = assistant_output.scrollHeight;
                    chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
                        if (chrome.runtime.lastError) {
                            console.log("Error setting data:", chrome.runtime.lastError);
                        }
                    });
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("[assistant_output_block_action_run] Error:", error);
                }
            } else if (action["dest"] == "tab") {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0].url.trim().length > 0 && !tabs[0].url.startsWith("chrome")) {
                        chrome.scripting.executeScript({
                            target: {tabId: tabs[0].id},
                            func: result["func"],
                            args: [result["paras"]],
                        }, function () {});
                    } else {
                        console.log("[retrieve_page_information chrome internal page]")
                        retrieve_online_information(prompt, context);
                    }
                });
            }
            button.disabled = false;
        })
    }
}

function assistant_output_block_text_change(block_text) {
    block_text.style.style.height = block_text.scrollHeight + "px";
}

function new_assistant_history_record(category) {
    let record = {
        "category" : category,
        "content" : {},
        "time" : "",
        "title" : "",
        "output_block" : "",
    }
    if (category == "text") {
        record["content"]["text"] = "";
    } else if (category == "action") {
        record["content"]["paras"] = {};
    }
    return record;
}

function add_record_to_assistant_history(record) {
    assistant_data["assistant_history"].push(record);
    while (assistant_data["assistant_history"].length > 100) {
        delete_record_from_assistant_history(assistant_data["assistant_history"][0]);
        console.log("[add_record_to_assistant_history] asistant history:", assistant_data["assistant_history"])
    }
    chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error setting data:", chrome.runtime.lastError);
        }
    });
};

function get_chat_history() {
    let history = [];
    for (let i = assistant_data["assistant_history"].length - 1; i >= 0; i--) {
        let record = assistant_data["assistant_history"][i];
        if (record["category"] == "text") {
            if (record["title"] == "You") {
                history.push(`[USER]: ${record["content"]["text"]}`);
            } else {
                history.push(`[${record["title"]}]: ${record["content"]["text"]}`);
            }
        }
    }
    return history;
}

function delete_record_from_assistant_history(record) {
    console.log("[delete_record_from_assistant_history] Record:", record)
    let record_index = -1;
    for (let i = 0; i < assistant_data["assistant_history"].length; i++) {
        if (assistant_data["assistant_history"][i] === record) {
            record_index = i;
            break;
        }
    }
    console.log("[delete_record_from_assistant_history] Record index:", record_index)
    if (record_index >= 0) {
        console.log("[delete_record_from_assistant_history] Block:", record["output_block"])
        console.log("[delete_record_from_assistant_history] History blocks:", assistant_history_blocks)
        if (record["output_block"] in assistant_history_blocks) {
            let block = assistant_history_blocks[record["output_block"]];
            if (assistant_output.contains(block)) {
                assistant_output.removeChild(block);
            }
            delete assistant_history_blocks[record["output_block"]];
        }
        delete assistant_data["assistant_history"].splice(record_index, 1);
    }
};

async function generate_assistant_output(prompt, context = null) {
    console.log("[generate_assistant_output] Prompt:", prompt);
    console.log("[generate_assistant_output] Context:", context);
    console.log("[generate_assistant_output] Memory:", assistant_data["assistant_memory"]);

    assistant_output_generating = true;

    if (context == null) context = {};

    context["chat_history"] = get_chat_history();

    if (assistant_data["assistant_memory"]["page_buffer"] != null) {
        context["page_info"] = assistant_data["assistant_memory"]["page_buffer"];
        context["page_content"] = context["page_info"]["content"];
        if (context["page_content"].trim().length > 0) {
            context["page_instruction"] = get_page_info_instruction();
        } else {
            context["page_instruction"] = get_empty_page_instruction();
        }
    } else {
        context["page_instruction"] = get_error_page_instruction();
    }

    if (assistant_input_online.checked == true) {
        if (assistant_data["assistant_memory"]["online_search_history"].length > 0 && assistant_data["assistant_memory"]["online_search_history"].at(-1)["prompt"] == prompt) {
            context["online_info"] = assistant_data["assistant_memory"]["online_search_history"].at(-1);
            context["online_content"] = "";
            for (let result of context["online_info"]["results"]) {
                context["online_content"] += result["title"] + ": " + result["brief"] + "\n";
            }
            if (context["online_content"].trim().length > 0) {
                context["online_instruction"] = get_online_info_instruction();
            } else {
                context["online_instruction"] = get_empty_online_instruction();
            }
        } else {
            context["online_instruction"] = get_error_online_instruction();
        }
    }
    console.log("[generate_assistant_output] Fixed context:", context);

    let provider = assistant_data["assistant_setting"]["provider"];
    let model = assistant_data["assistant_setting"]["model"];

    context["background"] = {
        "date" : get_current_date(),
        "time" : get_current_time(),
        "preferred_name" : assistant_data["personalization_setting"]["preferred_name"],
        "assistant_name" : assistant_data["personalization_setting"]["assistant_name"],
    }

    let prompt_with_context = rebuild_prompt_with_context(prompt, context)

    console.log("[generate_assistant_output] Provider:", provider)
    console.log("[generate_assistant_output] Model:", model)
    console.log("[generate_assistant_output] Prompt with context:", prompt_with_context)

    try {
        if (provider == "Ollama" && "Ollama" in provider_services) {
            let endpoint = assistant_data["ollama_setting"]["endpoint"];
            let path = "/api/generate";
            let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;

            const data = {
                "model" : model,
                // "prompt" : get_last_n_characters(prompt_with_context, 4000),
                "prompt" : prompt_with_context,
                "options": {
                    // "num_ctx": 10000,
                 },
                "stream" : true,
            };
            const response = await fetch(api_url, {
                "method" : "POST",
                "headers": {'Content-Type': 'application/json'},
                "body": JSON.stringify(data),
            });

            if (!response.ok) {
                alert("There is error in connecting to the provider.");
                console.log("Error in response:", response);
            } else {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];

                    const decoder = new TextDecoder('utf-8');
                    const reader = response.body.getReader();
                    let last_done = false;
                    while (assistant_output_generating) {
                        const {done, value} = await reader.read();
                        const chunk = decoder.decode(value);
                        last_done = done;
                        if (done) break;
                        new_record["content"]["text"] += JSON.parse(chunk).response;
                        new_block_text.innerText = new_record["content"]["text"];
                        new_record["time"] = current_datetime_to_key();
                        assistant_output.scrollTop = assistant_output.scrollHeight;
                    }

                    context["reference"] = new_block_text.innerText;

                    if (!last_done) {
                    }
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("Error calling Ollama:", error);
                }
            }
        } else if (provider == "Doubao" && "Doubao" in provider_services) {
            let token = assistant_data["doubao_setting"]["token"];
            let endpoint = "https://ark.cn-beijing.volces.com";
            let path = "api/v3/chat/completions"
            let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
            const data = {
                "model" : model,
                "messages" : [{
                    "role" : "user",
                    // "content" : get_last_n_characters(prompt_with_context, 10000),
                    "content" : prompt_with_context,
                }],
                "stream" : true,
            };
            const response = await fetch(api_url, {
                "method" : "POST",
                "headers": {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(data),
            });

            if (!response.ok) {
                alert("There is error in connecting to the provider.");
                console.log("Error in response:", response)
            } else {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];

                    const decoder = new TextDecoder('utf-8');
                    const reader = response.body.getReader();
                    let last_done = false;
                    while (assistant_output_generating) {
                        let {done, value} = await reader.read();
                        let chunk = decoder.decode(value);
                        // console.log("Done/Value/Chunk:", done, value, chunk)
                        last_done = done;
                        if (done) break;
                        const lines = chunk.split('\n');
                        lines.forEach(line => {
                            if (line.trim().slice(0, 5) == "data:") line = line.slice(5).trim();
                            if (line !== '' && line !== "[DONE]") {
                                let line_data = JSON.parse(line);
                                if (line_data.choices.length > 0) {
                                    new_record["content"]["text"] += line_data.choices[0].delta.content;
                                    new_block_text.innerText = new_record["content"]["text"];
                                    new_record["time"] = current_datetime_to_key();
                                    assistant_output.scrollTop = assistant_output.scrollHeight;
                                }
                            }
                        })
                    }

                    context["reference"] = new_block_text.innerText;

                    if (!last_done) {
                    }
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("Error calling Doubao:", error);
                }
            }
        } else if (provider == "QWen" && "QWen" in provider_services) {
            let token = assistant_data["qwen_setting"]["token"];
            let endpoint = "https://dashscope.aliyuncs.com/";
            let path = "compatible-mode/v1/chat/completions"
            let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
            const data = {
                "model" : model,
                "messages" : [{
                    "role" : "user",
                    // "content" : get_last_n_characters(prompt_with_context, 50000),
                    "content" : prompt_with_context,
                }],
                "stream" : true,
            };
            const response = await fetch(api_url, {
                "method" : "POST",
                "headers": {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(data),
            });

            if (!response.ok) {
                alert("There is error in connecting to the provider.");
                console.log("Error in response:", response)
            } else {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];

                    const decoder = new TextDecoder('utf-8');
                    const reader = response.body.getReader();
                    let last_done = false;
                    while (assistant_output_generating) {
                        let {done, value} = await reader.read();
                        let chunk = decoder.decode(value);
                        // console.log("Done/Value/Chunk:", done, value, chunk)
                        last_done = done;
                        if (done) break;
                        const lines = chunk.split('\n');
                        lines.forEach(line => {
                            if (line.trim().slice(0, 5) == "data:") line = line.slice(5).trim();
                            if (line !== '' && line !== "[DONE]") {
                                let line_data = JSON.parse(line);
                                if (line_data.choices.length > 0 && line_data.choices[0].delta.content !== undefined) {
                                    new_record["content"]["text"] += line_data.choices[0].delta.content;
                                    new_block_text.innerText = new_record["content"]["text"];
                                    new_record["time"] = current_datetime_to_key();
                                    assistant_output.scrollTop = assistant_output.scrollHeight;
                                }
                            }
                        })
                    }

                    context["reference"] = new_block_text.innerText;

                    if (!last_done) {
                    }
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("Error calling QWen:", error);
                }
            }
        } else if (provider == "SiliconFlow" && "SiliconFlow" in provider_services) {
            let token = assistant_data["siliconflow_setting"]["token"];
            let endpoint = "https://api.siliconflow.cn/";
            let path = "v1/chat/completions"
            let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
            const data = {
                "model" : model,
                "messages" : [{
                    "role" : "user",
                    // "content" : get_last_n_characters(prompt_with_context, 50000),
                    "content" : prompt_with_context,
                }],
                "stream" : true,
            };
            const response = await fetch(api_url, {
                "method" : "POST",
                "headers": {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(data),
            });

            if (!response.ok) {
                alert("There is error in connecting to the provider.");
                console.log("Error in response:", response)
            } else {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];

                    const decoder = new TextDecoder('utf-8');
                    const reader = response.body.getReader();
                    let last_done = false;
                    while (assistant_output_generating) {
                        let {done, value} = await reader.read();
                        let chunk = decoder.decode(value);
                        console.log("Done/Value/Chunk:", done, value, chunk)
                        last_done = done;
                        if (done) break;
                        const lines = chunk.split('\n');
                        lines.forEach(line => {
                            if (line.trim().slice(0, 5) == "data:") line = line.slice(5).trim();
                            if (line !== '' && line !== "[DONE]") {
                                let line_data = JSON.parse(line);
                                if (line_data.choices.length > 0 && line_data.choices[0].delta.content !== undefined) {
                                    new_record["content"]["text"] += line_data.choices[0].delta.content;
                                    new_block_text.innerText = new_record["content"]["text"];
                                    new_record["time"] = current_datetime_to_key();
                                    assistant_output.scrollTop = assistant_output.scrollHeight;
                                }
                            }
                        })
                    }

                    context["reference"] = new_block_text.innerText;

                    if (!last_done) {
                    }
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("Error calling QWen:", error);
                }
            }
        } else if (provider == "HF" && "HF" in provider_services) {
            let token = assistant_data["hf_setting"]["token"];
            let api_url = `https://api-inference.huggingface.co/models/${model}`;
            const data = {
                // "inputs" : get_last_n_characters(prompt_with_context, 4000),
                "inputs" : prompt_with_context,
                "stream" : true,
            };
            const response = await fetch(api_url, {
                "method" : "POST",
                "headers": {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(data),
            });

            if (!response.ok) {
                alert("There is error in connecting to the provider.");
                console.log("Error in response:", response)
            } else {
                let [new_block, new_record] = add_assistant_output_block("text")
                try {
                    let new_block_text = new_block.getElementsByClassName("assistant_output_text")[0];

                    const decoder = new TextDecoder('utf-8');
                    const reader = response.body.getReader();
                    let last_done = false;
                    while (assistant_output_generating) {
                        const {done, value} = await reader.read();
                        const chunk = decoder.decode(value);
                        console.log("Chunk:",chunk)
                        last_done = done;
                        if (done) break;
                        const lines = chunk.split('\n');
                        lines.forEach(line => {
                            if (line.trim() !== '') {
                                if (line.trim().slice(0, 5) == "data:") line = line.slice(5).trim();
                                let line_data = JSON.parse(line);
                                if (line_data.token) {
                                    new_record["content"]["text"] += line_data.token.text;
                                    new_block_text.innerText = new_record["content"]["text"];
                                    new_record["time"] = current_datetime_to_key();
                                    assistant_output.scrollTop = assistant_output.scrollHeight;
                                }
                            }
                        })
                    }

                    context["reference"] = new_block_text.innerText;

                    if (!last_done) {
                    }
                } catch (error) {
                    delete_record_from_assistant_history(new_record);
                    console.log("Error calling HF:", error);
                }
            }
        }
    } catch (error) {
        console.log("[generate_assistant_output] Error:", error);
    }

    chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
        if (chrome.runtime.lastError) {
            console.log("Error setting data:", chrome.runtime.lastError);
        }
    });

    assistant_output_generating = false;
    assistant_input_send.innerText = "Send";
    generate_assistant_actions(prompt, context);
};

async function generate_assistant_actions(prompt = null, context = null) {
    console.log("[generate_assistant_actions] Prompt:", prompt);
    console.log("[generate_assistant_actions] Context:", context);

    if (context == null) context = {};
    if (prompt == null) prompt = "";

    let prompt_for_actions = build_prompt_for_actions(prompt, context);

    console.log("[generate_assistant_actions] prompt_for_actions:", prompt_for_actions);
    if (prompt_for_actions.trim().length > 0) {
        let provider = assistant_data["assistant_setting"]["provider"];
        let model = assistant_data["assistant_setting"]["model"];
        let api_url = "";

        let content = "";
        let data = {};

        let result = "";
        if (provider == "Ollama" && "Ollama" in provider_services) {
            let endpoint = assistant_data["ollama_setting"]["endpoint"];
            let path = "/api/generate";
            api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
            result = await call_ollama_api(api_url, model, prompt_for_actions);
        } else if (provider == "Doubao" && "Doubao" in provider_services) {
            let token = assistant_data["doubao_setting"]["token"];
            result = await call_doubao_api(model, prompt_for_actions, token);
        } else if (provider == "QWen" && "QWen" in provider_services) {
            let token = assistant_data["qwen_setting"]["token"];
            result = await call_qwen_api(model, prompt_for_actions, token);
        } else if (provider == "SiliconFlow" && "SiliconFlow" in provider_services) {
            let token = assistant_data["siliconflow_setting"]["token"];
            result = await call_siliconflow_api(model, prompt_for_actions, token);
        } else if (provider == "HF" && "HF" in provider_services) {
            let token = assistant_data["hf_setting"]["token"];
            result = await call_hf_api(model, prompt_for_actions, token);
        }
        [content, data] = split_content_and_json(result);
        console.log("[generate_assistant_actions] Content:", content);
        console.log("[generate_assistant_actions] Data:", data);

        if ("action_name" in data && data["action_name"] in action_list && "action_paras" in data) {
            let action_name = data["action_name"];
            let action_paras = data["action_paras"];
            let action = action_list[action_name];


            let valid_paras = true;
            for (let key in action["paras"]) {
                if (key == "href") continue;
                if (key in action_paras) {
                    let value = action_paras[key];
                    if (typeof value === "string" && value.trim().length < 1) {
                        valid_paras = false;
                        break;
                    }
                    if (Array.isArray(value) && value.length < 1) {
                        valid_paras = false;
                        break;
                    }
                    if (isObject(value) && value.trim().length < 1) {
                        valid_paras = false;
                        break;
                    }
                } else {
                    valid_paras = false;
                    break;
                }
            }

            if (valid_paras === true) {
                let [new_block, new_record] = add_assistant_output_block("action")
                new_record["content"]["text"] = action_name;
                new_record["content"]["paras"] = {}

                for (let key in action["paras"]) {
                    if (key in action_paras) {
                        new_record["content"]["paras"][key] = action_paras[key];
                    }
                }

                if ("href" in new_record["content"]["paras"] && "page_info" in context) {
                    new_record["content"]["paras"]["href"] = context["page_info"]["href"];
                }

                let new_block_paras = new_block.getElementsByClassName("assistant_output_paras")[0];
                let new_block_table = new_block_paras.querySelector('table');

                for (let key of Object.keys(new_record["content"]["paras"]).sort()) {
                    let paras_row = new_block_table.insertRow();
                    paras_row.style.height = "24px";
                    let paras_key = paras_row.insertCell();
                    paras_key.className = "assistant_output_paras_key";
                    paras_key.innerText = key;
                    let paras_value = paras_row.insertCell();
                    paras_value.className = "assistant_output_paras_value";
                    let value = String(new_record["content"]["paras"][key]).trim().replace(/\n/g, "");
                    if (key == "href") {
                        paras_value.innerText = value.slice(0, 36);
                    } else {
                        paras_value.innerText = value.slice(0, 100);
                    }
                }

                let new_block_operations = new_block.getElementsByClassName('assistant_output_operations')[0];
                let new_block_name = new_block_operations.querySelector('label');
                new_block_name.innerText = new_record["content"]["text"];
                assistant_output.scrollTop = assistant_output.scrollHeight;

                chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
                    if (chrome.runtime.lastError) {
                        console.log("Error setting data:", chrome.runtime.lastError);
                    }
                });
            }
        }
    }
};

async function generate_page_update_actions(prompt = null, context = null) {
    console.log("[generate_page_update_actions] Prompt:", prompt);
    console.log("[generate_page_update_actions] Context:", context);

    if (context == null) context = {};

    if (prompt == null && "page_info" in context) {
        if (context["page_info"]["href"].includes("discord.com/channels")) {
        } else if (context["page_info"]["href"].includes("x.com")) {
        } else if (context["page_info"]["href"].includes("youtube.com")) {
        } else if (context["page_info"]["href"].includes("linkedin.com")) {
        } else {
            let [new_block, new_record] = add_assistant_output_block("action")
            try {
                new_record["content"]["text"] = "Page Summary";
                new_record["content"]["paras"] = {
                    "href" : context["page_info"]["href"],
                    "content" : context["page_info"]["content"],
                };

                let new_block_paras = new_block.getElementsByClassName("assistant_output_paras")[0];
                let new_block_table = new_block_paras.querySelector('table');

                for (let key of Object.keys(new_record["content"]["paras"]).sort()) {
                    let paras_row = new_block_table.insertRow();
                    paras_row.style.height = "24px";
                    let paras_key = paras_row.insertCell();
                    paras_key.className = "assistant_output_paras_key";
                    paras_key.innerText = key;
                    let paras_value = paras_row.insertCell();
                    paras_value.className = "assistant_output_paras_value";
                    let value = String(new_record["content"]["paras"][key]).trim().replace(/\n/g, "");
                    if (key == "href") {
                        paras_value.innerText = value.slice(0, 36);
                    } else {
                        paras_value.innerText = value.slice(0, 100);
                    }
                }

                let new_block_operations = new_block.getElementsByClassName('assistant_output_operations')[0];
                let new_block_name = new_block_operations.querySelector('label');
                new_block_name.innerText = new_record["content"]["text"];
                assistant_output.scrollTop = assistant_output.scrollHeight;

                chrome.storage.local.set({"assistant_history" : assistant_data["assistant_history"]}, () => {
                    if (chrome.runtime.lastError) {
                        console.log("Error setting data:", chrome.runtime.lastError);
                    }
                });
            } catch (error) {
                console.log("[generate_page_update_actions] Error calling LLM:", error);
            }
        }
    }
};

function clear_assistant_output() {
    assistant_output.innerHTML("");
}

function activate_tab(tab_name) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab_name).style.display = "block";
    document.getElementById(tab_name + "_bt").className += " active";

    if (tab_name == "assistant") {
        assistant_output.scrollTop = assistant_output.scrollHeight;
    }
}

function update_assistant_chat_input() {
    let chat_input = document.getElementById("assistant_chat_input");
    chat_input.style.width = window.innerWidth - 50 + "px";
    height = 200;
    chat_input.style.height = height + "px";
    chat_input.style.top = window.innerHeight - height - 20 + "px";
}

let default_assistant_data = {
    "assistant_setting" : {
        "provider" : "",
        "model" : "",
        "active_assistant" : true,
    },
    "personalization_setting" : {
        "preferred_name" : "",
        "assistant_name" : "",
    },
    "chatgpt_setting" : {
        "token" : "",
    },
    "claude_setting" : {
        "token" : "",
    },
    "qwen_setting" : {
        "token" : "",
    },
    "siliconflow_setting" : {
        "token" : "",
    },
    "ollama_setting" : {
        "endpoint" : "",
    },
    "assistant_history" : [],
    "assistant_memory" : {
        "online_search_tab" : null,
        "online_search_prompt" : null,
        "online_search_context" : null,
        "online_search_history" : [],
        "page_buffer" : null,
    },
}

let assistant_data = JSON.parse(JSON.stringify(default_assistant_data));

init_sidepanel();

function init_sidepanel() {
    console.log("[init_sidepanel]");

    chrome.storage.local.get(Object.keys(assistant_data), (result) => {
        if (chrome.runtime.lastError) {
            console.log("Error getting data:", chrome.runtime.lastError);
        } else {
            for (let key in assistant_data) {
                if (key in result) {
                    assistant_data[key] = result[key];
                }
            }
        }

        init_settings();
        update_provider_services();
        update_sidepanel_theme();
        load_assistant_history();
        activate_tab("assistant");
    });
}

function load_assistant_history() {
    console.log("[load_assistant_history]")
    console.log("Assistant history:", assistant_data["assistant_history"])
    assistant_output.innerHTML = "";
    for (let record of assistant_data["assistant_history"]) {
        add_assistant_output_block(record["category"], record["title"], record);
    }
    console.log("[load_assistant_history] History blocks:", assistant_history_blocks)
}

function init_settings() {
    assistant_output.innerHTML = "";
    for (let record of assistant_data["assistant_history"]) {
        add_assistant_output_block(record["category"], record["title"], record)
    }

    assistant_setting_active_input.checked = assistant_data["assistant_setting"]["active_assistant"];

    personalization_setting_preferred_name_input.value = assistant_data["personalization_setting"]["preferred_name"];
    personalization_setting_assistant_name_input.value = assistant_data["personalization_setting"]["assistant_name"];

    chatgpt_setting_token_input.value = assistant_data["chatgpt_setting"]["token"];
    claude_setting_token_input.value = assistant_data["claude_setting"]["token"];
    qwen_setting_token_input.value = assistant_data["qwen_setting"]["token"];
    siliconflow_setting_token_input.value = assistant_data["siliconflow_setting"]["token"];
    ollama_setting_endpoint_input.value = assistant_data["ollama_setting"]["endpoint"];
}

function update_sidepanel_theme() {
    let style_tag = document.querySelector('style');
    style_tag.innerHTML = daylight_style;
}

async function update_provider_services() {
    assistant_setting_provider_select.innerHTML = "";
    assistant_setting_model_select.innerHTML = "";
    if (assistant_data["ollama_setting"]["endpoint"].length > 0 && ollama_setting_block.style.display != "none") {
        let endpoint = assistant_data["ollama_setting"]["endpoint"];
        let path = "/api/tags";
        let api_url = `${endpoint}${endpoint.endsWith('/') || path.startsWith('/')? '' : '/'}${path}`;
        try {
            const response = await fetch(api_url, {"method" : "GET"});
            if (!response.ok) {
                alert("There is error in connecting to Ollama.");
                console.log("[update_provider_services] Error in response:", response);
            } else {
                const data = await response.json();
                const models = data["models"];
                if (models.length > 0) {
                    let provider_option = document.createElement("option");
                    provider_option.innerText = "Ollama";
                    assistant_setting_provider_select.appendChild(provider_option);
                    provider_services["Ollama"] = {"models" : {}};
                    for (let model of models) {
                        provider_services["Ollama"]["models"][model["name"]] = model;
                    }
                } else {
                    alert("Can't find any available models with Ollama.");
                }
            }
        } catch (error) {
            console.log("[update_provider_services] Error in getting available models with Ollama:", error);
        }
    }
    if (assistant_data["qwen_setting"]["token"].length > 0 && qwen_setting_block.style.display != "none") {
        let provider_option = document.createElement("option");
        provider_option.innerText = "QWen";
        assistant_setting_provider_select.appendChild(provider_option);
        provider_services["QWen"] = {"models" : {
            "qwen-turbo" : {
                "model" : "qwen-turbo",
                "details" : {"family" : "qwen"},
            },
            "qwen-plus" : {
                "model" : "qwen-plus",
                "details" : {"family" : "qwen"},
            },
            "qwen-long" : {
                "model" : "qwen-long",
                "details" : {"family" : "qwen"},
            },
            "qwen-max" : {
                "model" : "qwen-max",
                "details" : {"family" : "qwen"},
            },
            "qwen-max" : {
                "model" : "qwen-max",
                "details" : {"family" : "qwen"},
            },
            "deepseek-v3" : {
                "model" : "deepseek-v3",
                "details" : {"family" : "deepseek"},
            },
            "deepseek-r1" : {
                "model" : "deepseek-r1",
                "details" : {"family" : "deepseek"},
            },
        }};
    }
    if (assistant_data["siliconflow_setting"]["token"].length > 0 && siliconflow_setting_block.style.display != "none") {
        let provider_option = document.createElement("option");
        provider_option.innerText = "SiliconFlow";
        assistant_setting_provider_select.appendChild(provider_option);
        provider_services["SiliconFlow"] = {"models" : {
            "Qwen/QVQ-72B-Preview" : {
                "model" : "Qwen/QVQ-72B-Preview",
                "details" : {"family" : "deepseek"},
            },
            "deepseek-ai/DeepDeek-V3" : {
                "model" : "deepseek-ai/DeepSeek-V3",
                "details" : {"family" : "deepseek"},
            },
            "deepseek-ai/DeepDeek-R1" : {
                "model" : "deepseek-ai/DeepSeek-R1",
                "details" : {"family" : "deepseek"},
            },
        }};
    }
    assistant_setting_provider_select.dispatchEvent(new Event("change"));

    console.log("[update_provider_services] Providers:", provider_services);
    if (!(assistant_data["assistant_setting"]["provider"] in provider_services)) {
        console.log(assistant_data["assistant_setting"]["provider"]);
    } else {
        for (let i = 0; i < assistant_setting_provider_select.options.length; i++) {
            let option = assistant_setting_provider_select.options[i];
            if (option.text == assistant_data["assistant_setting"]["provider"]) {
                assistant_setting_provider_select.selectedIndex = i;
            }
        }
        assistant_setting_provider_select.dispatchEvent(new Event("change"));
        if (!(assistant_data["assistant_setting"]["model"] in provider_services[assistant_data["assistant_setting"]["provider"]]["models"])) {
        } else {
            for (let i = 0; i < assistant_setting_model_select.options.length; i++) {
                let option = assistant_setting_model_select.options[i];
                if (option.text == assistant_data["assistant_setting"]["model"]) {
                    assistant_setting_model_select.selectedIndex = i;
                }
            }
        }
    }
}

function extract_google_search_page_content(document) {
    let content = {"text" : "google_test"}
    return content;
}

function extract_page_content(document) {
    let content = {"text" : "test"}
    return content;
}

const ignore_update_hosts = [
    "chrome://", "chrome-extension://",
    "google.com", "bing.com", "baidu.com", "youtube.com",
    "chatgpt.com", "poe.com", "doubao.com/chat",
    "notion.so",
];

chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
    if (!tab.url.startsWith("chrome") && change_info.status === "complete") {
        if (assistant_input_online.checked == true && tab_id == assistant_data["assistant_memory"]["online_search_tab"]) {
            chrome.scripting.executeScript({
                target: {tabId: tab_id},
                files: ["search.js"],
            }, function (result) {
                let info = result[0].result;
                info["prompt"] = assistant_data["assistant_memory"]["online_search_prompt"];
                assistant_data["assistant_memory"]["online_search_history"].push(info);
                if (assistant_data["assistant_memory"]["online_search_prompt"] != null) {
                    let prompt = assistant_data["assistant_memory"]["online_search_prompt"];
                    let context = assistant_data["assistant_memory"]["online_search_context"];
                    generate_assistant_output(prompt, context);
                    assistant_data["assistant_memory"]["online_search_prompt"] = null;
                    assistant_data["assistant_memory"]["online_search_context"] = null;
                    chrome.storage.local.set({"assistant_memory" : assistant_data["assistant_memory"]}, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error setting data:", chrome.runtime.lastError);
                        }
                    });
                }
            });
        } else if (assistant_data["assistant_setting"]["active_assistant"] == true) {
            if (ignore_update_hosts.every(host => !tab.url.includes(host))) {
                chrome.scripting.executeScript({
                    target: {tabId: tab_id},
                    files: ["content.js"],
                }, function (result) {
                    if (result) {
                        let context = {"page_info" : result[0].result};
                        generate_page_update_actions(null, context);
                    }
                });
            }
        }
    }
});

