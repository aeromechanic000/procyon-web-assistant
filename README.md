# Procyon Web Assistant


The github page for the chrome extension procyon-web-assistant.

## About aeromechanic

🚀 AI enthusiast | 🔥 Exploring the future of AI in interactive experiences ｜ 🎮 Building AI tools for gaming 

🐦 X: https://x.com/aeromechan71402

💻 Github: https://github.com/aeromechanic000/

📺 Youtube: https://www.youtube.com/channel/UCGdit7JXNSmdgc7Iuz4e6xw

🎮 Discord: https://discord.gg/PJv8TrBYVJ

## Quick Start

### Add Procyon Web Assistant to Chrome Extensions 

Procyon Web Assistant is under development. For people who would like to take the code as a refenrece or interested use it to better process webpages with the help of LLMs, they can download the source code into a local directory and follow the process to install an Chome Extension from unpacked files as instructed in Chrome's official tutorial
(https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world).

[![Tutorial #0: Manually Add The Chrome Extension](https://img.youtube.com/vi/Q_jdB3hdS84/0.jpg)](https://www.youtube.com/watch?v=Q_jdB3hdS84)

### Access to Local Ollama

To access the locally deployed Ollama, you need to manually adjust its security settings.
(As part of this project, we aim to provide a solution with full transparency, ensuring users can use the Procyon Web Assistant without concerns about privacy leaks or security risks.)

[![Tutorial #1: Access to Local Ollama](https://img.youtube.com/vi/X1uTVUjqh40/0.jpg)](https://www.youtube.com/watch?v=X1uTVUjqh40)

1. To modify Ollama's security level, run the following command in the terminal:

```
    launchctl setenv OLLAMA_ORIGINS "*"
```

2. Restart Ollama.
3. **Note** : You will need to set the OLLAMA_ORIGINS environment variable each time the hosting computer is restarted.
4. It is absolutely okay if you use a remotely deployed Ollama, just to make sure the security level of the deployed Ollama allows remote access. 

### Set Ollama Endpoint 

Put the API URL (by defaut, it is http://192.168.158.8:11434 ) into the "Endpoint" field of "Ollama Setting" in the setting tab, and save.

### Select Provider and Model

Select a provider (e.g. Ollama) and a model in the "Asssitant Setting", and remember to click "Save" button for the new setting to take effect.

### Start Chat

Now you can start chat with the assistant, and the webpage you are reading will be included as a reference.

