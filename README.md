# Procyon Web Assistant


The github page for the chrome extension procyon-web-assistant.

## About aeromechanic

🚀 AI enthusiast | 🔥 Exploring the future of AI in interactive experiences ｜ 🎮 Building AI tools for gaming 

🧑‍💻 Github: https://github.com/aeromechanic000/

📺 Youtube: https://www.youtube.com/channel/UCGdit7JXNSmdgc7Iuz4e6xw

🎮 Discord: https://discord.gg/PJv8TrBYVJ

## Quick Start

### Add Procyon Web Assistant to Chrome Extensions 

### Access to Ollama

To access the local deployed Ollama, you need to chhange the security level of Ollama mannually. 
(As in the this project, we are aiming to provide a solution without any hidden operations, which we 
believe a necessary feature for people to use procyon web assistant without any concern about the 
privacy leakage or safety issues.)

1. To modify the security level of ollama, you should run the following command in termial

    launchctl setenv OLLAMA_ORIGINS "*"

2. Then restart Ollama. 
3. Remember you should set OLLAMA_ORIRINS every time when the computer hosting Ollama is restarted, unless you put the above command in the starting script (e.g. ~/.bashrc or ~/.zshrc). 
