let blipChatInstance; // Armazena a instância do Blip Chat
let username; // Variável global para armazenar o username
let chat; // Instância do BlipChatWidget

// Função para gerar UUID no navegador
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Configurações do Blip Chat
const WIDGET_CUSTOM_COMMON_URL = 'https://cda-tixwp.chat.blip.ai/';
const url ='https://cda-tixwp.chat.blip.ai/';
const BLIP_CHAT_CONTAINER_ID_SELECTOR = '#blip-chat-container';
const MESSAGE_BUBBLE_CLASS_SELECTOR = 'message-bubble';
const APP_KEY = 'bWFzdGVydHJhY2twZXJzb25hbGl6YWRvOjIxNDI1Y2NiLTViODgtNGUyZS04MDIwLTVlZTZlMWFjMjc5Ng==';

// Função para enviar mensagens
function functionTT(param) {
    if (chat && chat.widget) {
        chat.widget.sendMessage({
            type: 'text/plain',
            content: param,
        });
    }
}

class BlipChatWidget {
    constructor(
        messages = [],
        messagesOption = [],
        messageDelay = 0,
        mainColor = '#FFFFFF', // Vermelho Masterboi
        secondaryColor = '#FF0000',
        transparent = 'transparent'
    ) {
        this.messages = messages;
        this.messagesOption = messagesOption;
        this.messageDelay = messageDelay;
        this.mainColor = mainColor;
        this.transparent = transparent;
        this.secondaryColor = secondaryColor;
    }

    closeBlipChat() {
        try {
            this.widget.destroy();
            this.widget = undefined;
        } catch (e) {
            return e;
        }
    }

    reload(params, keyword) {
        this.widget = new BlipChat();
        this.widget
            .withAppKey(APP_KEY)
            .withButton({
                color: this.transparent,
                icon: './vaca.png' // Substitua por blipinho-hi.svg se disponível
            })
            .withCustomMessageMetadata({
                pageOrigin: url
            })
            .withCustomCommonUrl(WIDGET_CUSTOM_COMMON_URL)
            .withCustomStyle(this.customStyle)
            .withAuth({
                authType: BlipChat.DEV_AUTH,
                userIdentity: username,
                userPassword: "123" // Use a senha correta
            })
            .withAccount({
                fullName: username + ' da silva',
                email: username + '@gmail.com',
                phoneNumber: '+15055034455',
                city: 'Fortaleza',
            })
            .withEventHandler(BlipChat.LOAD_EVENT, () => {
                this.widget.sendMessage({
                    type: 'text/plain',
                    content: params,
                });
            })
            .build();
        this.widget.toogleChat();
        document.getElementById('bubble')?.remove();
    }

    init() {
        this.setUpCustomCss();
        this.mount();
        this.addMessageBubbleIfAny();
        this.addOptionMessageIfAny();
        this.addContainerMessage();
        this.addOnclick();
    }

    mount() {
        this.widget = new BlipChat();
        this.widget
            .withAppKey(APP_KEY)
            .withButton({
                color: this.transparent,
                icon: './vaca.png' // Substitua por blipinho-hi.svg se disponível
            })
            .withCustomMessageMetadata({
                pageOrigin: url,
            })
            .withCustomCommonUrl(WIDGET_CUSTOM_COMMON_URL)
            .withCustomStyle(this.customStyle)
            .withAuth({
                authType: BlipChat.DEV_AUTH,
                userIdentity: username,
                userPassword: "123" // Use a senha correta
            })
            .withAccount({
                fullName: username + ' da silva',
                email: username + '@gmail.com',
                phoneNumber: '+15055034455',
                city: 'Fortaleza',
            })
            .withEventHandler(BlipChat.ENTER_EVENT, () => {
                if (!!this.addMessageBubbleTimeout) {
                    clearTimeout(this.addMessageBubbleTimeout);
                }
                document.querySelector('#blip-chat-iframe').style.position = 'fixed';
            })
            .withEventHandler(BlipChat.LOAD_EVENT, () => {
                if (!!tt) {
                    this.widget.sendMessage({
                        type: 'text/plain',
                        content: tt,
                    });
                }
            })
            
            
            .build();
        this.widgetElement = document.querySelector(BLIP_CHAT_CONTAINER_ID_SELECTOR);
        const icon = document.getElementById('blip-chat-icon');
        //icon.setAttribute('onClick', "functionTT('oi')");
    }

    setUpCustomCss() {
        this.customStyle = `
    .blip-card .bubble.left, .blip-card .bubble.middle {
        color: #292929 !important;
    }
    .select .options li {
        color: ${this.mainColor} !important;
        background-color: ${this.secondaryColor} !important;
        border-color: ${this.mainColor} !important;
    }
    #blip-chat-container {
        height: 100vh !important;
        max-height: 100vh !important;
    }
    #blip-chat-window {
        height: 100% !important;
    }
    #message-list {
        height: calc(100% - 60px) !important;
    }
`;

    }

    addContainerMessage() {
        this.containerMessage = document.createElement('div');
        this.containerMessage.classList.add('containerMessage');
        function insertAfter(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        const div = document.getElementById('blip-chat-open-iframe');
        insertAfter(div, this.containerMessage);
    }

    addMessageBubbleIfAny() {
        if (!!this.messages && this.messages.length > 0) {
            this.addMessageBubbleTimeout = setTimeout(
                this.addMessageBubble.bind(this),
                this.messageDelay
            );
        }
    }

    addMessageBubble() {
        this.messageBubble = document.createElement('div');
        this.messageBubble.classList.add(MESSAGE_BUBBLE_CLASS_SELECTOR);
        this.messageBubble.setAttribute('id', 'bubble');
        const icon = document.getElementById('blip-chat-icon');
        function parseHTML(html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t.content;
        }
        this.messages.forEach((m) => {
            const message = document.createElement('div');
            message.classList.add('textContainer');
            message.append(
                parseHTML(`<span onClick="functionTT('oi')" id="text-bubble">` + m + `</span>`)
            );
            this.messageBubble.appendChild(message);
        });
        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        this.messageBubble.appendChild(closeButton);
        const removeBubble = (e) => {
            if (!!e) {
                e.stopPropagation();
            }
            if (!!this.messageBubble) {
                this.messageBubble.remove();
                delete this.messageBubble;
                this.messageOptionContainer?.remove();
                delete this.messageOptionContainer;
            }
            if (!!this.OptionMessage) {
                this.OptionMessage.remove();
                delete this.OptionMessage;
            }
        };
        var widgetOpened = document.getElementById('blip-chat-open-iframe');
        const removeBubbleAndStartChat = () => {
            if (widgetOpened.classList.contains('opened') === true) {
            } else {
                this.widget.toogleChat();
                removeBubble();
            }
        };
        this.messageBubble.addEventListener('click', removeBubbleAndStartChat.bind(this));
        this.widgetElement.addEventListener('click', removeBubble.bind(this));
        closeButton.addEventListener('click', removeBubble.bind(this));
    }

    addOptionMessageIfAny() {
        if (!!this.messagesOption && this.messagesOption.length > 0) {
            this.addOptionMessageTimeout = setTimeout(
                this.addOptionMessage.bind(this),
                this.messageDelay
            );
        } else {
            this.addOptionMessageTimeout = setTimeout(
                this.addOptionMessage.bind(this),
                this.messageDelay
            );
            console.log('working');
            var x = document.querySelectorAll('#blip-chat-open-iframe');
            x[0].style.setProperty('margin-top', '90px', 'important');
        }
    }

    addOptionMessage() {
        this.messageOptionContainer = document.createElement('div');
        this.messageOptionContainer.classList.add('option-message');
        function parseHTML(html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t.content;
        }
        this.messagesOption.forEach((i) => {
            const message = document.createElement('li');
            message.append(
                parseHTML(`<a onClick="functionTT('${i}')" id="messages-option">` + i + `</a>`)
            );
            this.messageOptionContainer.appendChild(message);
        });
        const removeOptionMessage = (e) => {
            if (!!e) {
                e.stopPropagation();
            }
            if (!!this.messageOptionContainer) {
                this.messageOptionContainer.remove();
                delete this.messageOptionContainer;
            }
        };
        const removeOptionMessageAndStartChat = () => {
            this.widget.toogleChat();
            removeOptionMessage();
        };
        this.messageOptionContainer.addEventListener('click', removeOptionMessageAndStartChat.bind(this));
        this.widgetElement.addEventListener('click', removeOptionMessage.bind(this));
        this.containerMessage.appendChild(this.messageBubble);
        this.containerMessage.appendChild(this.messageOptionContainer);
    }

    addOnclick() {
        // Adicionar eventos de clique para links, se necessário
    }
}

// Simulação de Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    username = document.getElementById('username').value;
    chat = new BlipChatWidget(
        ['Oi, eu sou o <b>Mastertrack</b>!'], // Mensagem do balão
        ['Quero solicitar drafts', 'Quero solicitação alteração em Documentos'], // Opções
        1000 // Delay de 1 segundo
    );
    chat.init();
});

// Headers para as requisições HTTP
const headers = {
    'Authorization': 'Key bWFzdGVydHJhY2twZXJzb25hbGl6YWRvOnBSTXg2aFN4RGVMYVVCdmYyMmh2',
    'Content-Type': 'application/json',
    'Cookie': '__cf_bm=QTAMdl_dM9KWGomQq1FooGXR8J7rJutjPM.WYsoDA7A-1747745022-1.0.1.1-Uzv9bsVGEFSb_ReWytzBcMX_olumZiYexmoFc4shSOWp..LSKoZbwXwEfq7iqpnqxn8Zd7R93CpKfy8rCgWw.hUO6xhrtQrYU3fljy.OJM8'
};

// Evento do botão "Enviar Schedule"
document.getElementById('send-schedule-btn').addEventListener('click', async () => {
    if (!username) {
        console.error('❌ Username não definido. Faça login novamente.');
        return;
    }
    const to = `${username}.mastertrackpersonalizado@0mn.io`;
    const messages = [
        {
            id: generateUUID(),
            to: "postmaster@builder.msging.net",
            method: "set",
            uri: `/contexts/${to}/stateid@6df16a6c-6be7-430f-b888-94b0772e7262`,
            type: "text/plain",
            resource: "599cb579-761b-4490-bc37-49d668d84430"
        },
        {
            id: generateUUID(),
            to,
            type: "application/vnd.lime.media-link+json",
            content: {
                title: "[Baixar Proforma MB251/25]",
                uri: "https://araucariageneticabovina.com.br/arquivos/servico/pdfServico_57952bf8ca7af_24-07-2016_17-58-32.pdf",
                type: "application/pdf",
                size: 5540
            }
        },
        {
            id: generateUUID(),
            to,
            type: "application/vnd.lime.media-link+json",
            content: {
                title: "[Baixar Schedule de Embarque]",
                uri: "https://araucariageneticabovina.com.br/arquivos/servico/pdfServico_57952bf8ca7af_24-07-2016_17-58-32.pdf",
                type: "application/pdf",
                size: 12345
            }
        },
        {
            id: generateUUID(),
            to,
            type: "application/vnd.lime.select+json",
            content: {
                scope: "immediate",
                text: "Resumo:\nNavio: MSC BIANCA\nPorto de embarque: Vila do Conde\nPorto destino: Jebel Ali\nETA: 30/Maio/2025\nPeso/container: 25.000 kg\nPaletizado: ✅\n\nVocê confirma o aceite dessas informações?",
                options: [
                    { order: 1, text: "Sim, aprovado" },
                    { order: 2, text: "Não, desejo solicitar ajustes" }
                ]
            }
        }
    ];

    for (const msg of messages) {
        try {
            const isCommand = msg.method === "set";
            const url = isCommand ? "https://http.msging.net/commands" : "https://http.msging.net/messages";
            const response = await axios.post(url, msg, { headers });
            console.log(`✅ ${isCommand ? 'Comando' : 'Mensagem'} ${msg.id} enviada com status:`, response.status);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.error(`❌ Erro ao enviar ${msg.id}:`, err.response?.data || err.message);
        }
    }
});

// Evento do botão "Emitir Pré-Proforma"
document.getElementById('emit-pre-proforma-btn').addEventListener('click', async () => {
    if (!username) {
        console.error('❌ Username não definido. Faça login novamente.');
        return;
    }
    const to = `${username}.mastertrackpersonalizado@0mn.io`;
    const messages = [
        {
            id: generateUUID(),
            to: "postmaster@builder.msging.net",
            method: "set",
            uri: `/contexts/${to}/stateid@6df16a6c-6be7-430f-b888-94b0772e7262`,
            type: "text/plain",
            resource: "64e2fa56-2aa0-4110-a433-61c3b2cb4589"
        },
        {
            id: generateUUID(),
            to,
            type: "application/vnd.lime.select+json",
            content: {
                scope: "immediate",
                text: "Olá! Antes de seguirmos com a emissão da sua proforma, por gentileza, confirme algumas informações importantes:\n\n1️⃣ O contrato exige <b>paletização</b>?",
                options: [
                    { text: "Sim" },
                    { text: "Não" }
                ]
            }
        }
    ];

    for (const msg of messages) {
        try {
            const isCommand = msg.method === "set";
            const url = isCommand ? "https://http.msging.net/commands" : "https://http.msging.net/messages";
            const response = await axios.post(url, msg, { headers });
            console.log(`✅ ${isCommand ? 'Comando' : 'Mensagem'} ${msg.id} enviada com status:`, response.status);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.error(`❌ Erro ao enviar ${msg.id}:`, err.response?.data || err.message);
        }
    }
});
