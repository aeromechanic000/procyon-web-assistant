
function extract_text_from_DOM(element) {
    let text = '';
    const nodes = element.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (["H1", "H2", "H3", "P"].includes(node.tagName)) {
            if (node.textContent.trim().length > 0) {
                text += node.textContent.trim() + " ";
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            let content = extract_text_from_DOM(node)
            if (content.trim().length > 0) {
                text += content.trim() + " ";
            }
        }
      }
    return text;
}

function extract_discord_chats_from_DOM(element) {
    var info = {
        "html" : document.documentElement.innerHTML,
        "href" : window.location.href,
        "chats" : [],
    };

    let chat_elements = document.querySelectorAll('div[class*=contents_');
    for (let chat_element of chat_elements) {
        let user_element = chat_element.querySelector('span[class*=username_]');
        let user = "";
        if (user_element != null) user = user_element.textContent;
        let time_element = chat_element.querySelector('time');
        let time = "";
        if (time_element != null) time = time_element.textContent;
        let message = "";
        for (let tag of ["messageContent_"]) {
            let message_element = chat_element.querySelector(`div[class*=${tag}]`);
            if (message_element != null) {
                message += " " + message_element.textContent;
            }
        }
        if (user.trim().length > 0) {
            info["chats"].push({user: user, time: time, message: message});
        }
    }
    let text = "";
    for (let chat of info["chats"]) {
        text += `${chat["user"]} (${chat["time"]}): ${chat["message"]}; \n`
    }
    return text;
}

function extract_web_info() {
    let info = {
        "html" : document.body.innerHTML,
        "href" : window.location.href,
        "content" : "",
    };
    if (info["href"].includes("www.google.com/search")) {
        let text = extract_text_from_DOM(document.body)
        info["content"] = text.replace(/\n/g, "")
    } else if (info["href"].includes("discord.com/channels")) {
        let text = extract_discord_chats_from_DOM(document.body)
        info["content"] = text.replace(/\n/g, "")
    } else {
        let text = extract_text_from_DOM(document.body)
        info["content"] = text.replace(/\n/g, "")
    }
    return info;
}

extract_web_info();
