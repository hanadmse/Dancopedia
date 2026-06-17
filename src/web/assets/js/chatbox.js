function initializeChatbox() {
    const storageKey = "dancopedia.chatbox.state";
    const script = document.currentScript || document.querySelector('script[src*="/assets/js/chatbox.js"], script[src*="assets/js/chatbox.js"]');
    const publicBase = script ? new URL("../../", script.src).href : `${window.location.origin}/`;
    const assetBase = new URL("assets/images/", publicBase).href;

    const chatboxFaceUrl = new URL("chatbox_face.jpg", assetBase).href;
    document.querySelectorAll('#cbToggle img, #cbPanel .cb-avatar, #cbMessages .cb-msg-avatar').forEach(img => {
        img.src = chatboxFaceUrl;
    });


    const fab       = document.getElementById("cbToggle");
    const panel     = document.getElementById("cbPanel");
    const closeBtn  = document.getElementById("cbClose");
    const messages  = document.getElementById("cbMessages");
    const input     = document.getElementById("cbInput");
    const sendBtn   = document.getElementById("cbSend");
    const charCount = document.getElementById("cbCharCount");

    if (!fab || !panel || !messages || !input || !sendBtn) {
        console.error("Chatbox: required elements not found.");
        return;
    }

    const INPUT_LIMIT = parseInt(input.getAttribute("maxlength") || "200", 10);
    if (charCount) {
        input.addEventListener("input", () => {
            const remaining = INPUT_LIMIT - input.value.length;
            charCount.textContent = remaining;
            charCount.classList.toggle("cb-char-warn", remaining <= 20);
        });
    }

    let closing = false;
    const initialMessages = Array.from(messages.querySelectorAll(".cb-msg")).map(row => ({
        role: row.classList.contains("cb-msg--user") ? "user" : "ai",
        text: row.querySelector(".cb-bubble")?.textContent || "",
    })).filter(message => message.text);

    function readState() {
        try {
            const state = JSON.parse(sessionStorage.getItem(storageKey) || "null");
            if (!state || !Array.isArray(state.messages)) return null;
            return {
                isOpen: state.isOpen === true,
                messages: state.messages.filter(message =>
                    message &&
                    (message.role === "ai" || message.role === "user") &&
                    typeof message.text === "string" &&
                    message.text.trim() !== ""
                ),
            };
        } catch (err) {
            console.warn("Chatbox: failed to read saved state.", err);
            return null;
        }
    }

    function getRenderedMessages() {
        return Array.from(messages.querySelectorAll(".cb-msg:not(.cb-typing)")).map(row => ({
            role: row.classList.contains("cb-msg--user") ? "user" : "ai",
            text: row.querySelector(".cb-bubble")?.textContent || "",
        })).filter(message => message.text);
    }

    function saveState(isOpen = panel.classList.contains("cb-open")) {
        try {
            sessionStorage.setItem(storageKey, JSON.stringify({
                isOpen,
                messages: getRenderedMessages(),
            }));
        } catch (err) {
            console.warn("Chatbox: failed to save state.", err);
        }
    }

    function clearState() {
        try {
            sessionStorage.removeItem(storageKey);
        } catch (err) {
            console.warn("Chatbox: failed to clear state.", err);
        }
    }

    function openPanel() {
        closing = false;
        panel.style.display = "";
        panel.getBoundingClientRect();
        panel.classList.add("cb-open");
        panel.setAttribute("aria-hidden", "false");
        saveState(true);
    }

    function resetMessages() {
        messages.innerHTML = "";
        initialMessages.forEach(message => appendMessage(message.text, message.role, false));
    }

    function closePanel({ reset = true } = {}) {
        closing = true;
        panel.classList.remove("cb-open");
        panel.setAttribute("aria-hidden", "true");
        setTimeout(() => {
            if (closing) panel.style.display = "none";
        }, 240);

        if (reset) {
            try { sessionStorage.setItem("dancopedia.chatbox.dismissed", "1"); } catch (e) {}
            clearState();
            resetMessages();
        } else {
            saveState(false);
        }
    }

    fab.addEventListener("click", () => {
        panel.classList.contains("cb-open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);

    function appendMessage(text, role, persist = true) {
        const row = document.createElement("div");
        row.className = `cb-msg cb-msg--${role}`;

        if (role === "ai") {
            const avatar = document.createElement("img");
            avatar.src       = new URL("chatbox_face.jpg", assetBase).href;
            avatar.alt       = "AI";
            avatar.className = "cb-msg-avatar";
            row.appendChild(avatar);
        }

        const bubble = document.createElement("div");
        bubble.className   = "cb-bubble";
        bubble.textContent = text;
        row.appendChild(bubble);

        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
        if (persist) saveState();
        return row;
    }

    function showTyping() {
        const row = document.createElement("div");
        row.className = "cb-msg cb-msg--ai cb-typing";
        row.id = "cbTyping";

        const avatar = document.createElement("img");
        avatar.src       = new URL("chatbox_face.jpg", assetBase).href;
        avatar.alt       = "AI";
        avatar.className = "cb-msg-avatar";
        row.appendChild(avatar);

        const bubble = document.createElement("div");
        bubble.className = "cb-bubble";
        bubble.innerHTML = '<span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>';
        row.appendChild(bubble);

        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        const t = document.getElementById("cbTyping");
        if (t) t.remove();
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        const history = getRenderedMessages()
            .slice(-4)
            .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

        appendMessage(text, "user");
        input.value = "";
        sendBtn.disabled = true;
        showTyping();

        try {
            const response = await fetch(new URL("api/chat.php", publicBase).href, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ message: text, history }),
            });

            const data = await response.json();
            hideTyping();
            appendMessage(data.response || "Sorry, I couldn't get a response.", "ai");
        } catch (err) {
            console.error("Chatbox error:", err);
            hideTyping();
            appendMessage("Connection error — please try again.", "ai");
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

    const savedState = readState();
    let alreadyOpened = false;
    if (savedState && savedState.messages.length > 0) {
        messages.innerHTML = "";
        savedState.messages.forEach(message => appendMessage(message.text, message.role, false));
        if (savedState.isOpen) { openPanel(); alreadyOpened = true; }
    }

    if (!alreadyOpened && window.dancopediaChatAutoOpen) {
        const dismissed = sessionStorage.getItem("dancopedia.chatbox.dismissed") === "1";
        if (!dismissed) {

            const avatar = panel.querySelector(".cb-avatar");
            const open = () => requestAnimationFrame(() => requestAnimationFrame(openPanel));
            if (avatar && !avatar.complete) {
                avatar.addEventListener("load", open, { once: true });
                avatar.addEventListener("error", open, { once: true });
            } else {
                open();
            }
        }
    }
}

initializeChatbox();
