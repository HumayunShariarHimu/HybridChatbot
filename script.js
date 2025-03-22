async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    // ইউজারের প্রশ্ন চ্যাট বক্সে দেখানো
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;

    // চারটি AI থেকে রেসপন্স নেওয়া
    let responses = await Promise.all([
        fetchChatGPT(userInput),
        fetchGemini(userInput),
        fetchDeepSeek(userInput),
        fetchLaMDA(userInput)
    ]);

    // আলাদা আলাদা AI রেসপন্স শো করা
    chatBox.innerHTML += `<div><strong>ChatGPT:</strong> ${responses[0]}</div>`;
    chatBox.innerHTML += `<div><strong>Gemini:</strong> ${responses[1]}</div>`;
    chatBox.innerHTML += `<div><strong>DeepSeek:</strong> ${responses[2]}</div>`;
    chatBox.innerHTML += `<div><strong>LaMDA:</strong> ${responses[3]}</div>`;

    // সমস্ত রেসপন্স বিশ্লেষণ করে সঠিক উত্তর বের করা
    let refinedAnswer = await refineBestResponse(responses);
    chatBox.innerHTML += `<div><strong>Final Answer:</strong> ${refinedAnswer}</div>`;
}

// ChatGPT API কল
async function fetchChatGPT(query) {
    let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEYS.ChatGPT}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: query }]
        })
    });
    let data = await response.json();
    return data.choices[0].message.content;
}

// Gemini API কল
async function fetchGemini(query) {
    let response = await fetch(`https://api.google.com/gemini?query=${query}&key=${API_KEYS.Gemini}`);
    let data = await response.json();
    return data.answer || "No response from Gemini";
}

// DeepSeek API কল
async function fetchDeepSeek(query) {
    let response = await fetch(`https://api.deepseek.com/chat?query=${query}&key=${API_KEYS.DeepSeek}`);
    let data = await response.json();
    return data.result || "No response from DeepSeek";
}

// LaMDA API কল
async function fetchLaMDA(query) {
    let response = await fetch(`https://api.lamda.com/chat?query=${query}&key=${API_KEYS.LaMDA}`);
    let data = await response.json();
    return data.answer || "No response from LaMDA";
}

// সমস্ত রেসপন্স বিশ্লেষণ এবং সঠিক উত্তর নির্ধারণ
async function refineBestResponse(responses) {
    let bestResponse = responses[0]; // ChatGPT এর উত্তর প্রথমে ধরে নিচ্ছি

    responses.forEach(response => {
        // সঠিক উত্তর নির্ধারণের জন্য যেকোনো উন্নত বিশ্লেষণ মেথড যোগ করা যেতে পারে
        if (response.length > bestResponse.length) {
            bestResponse = response;
        }
    });

    return bestResponse;
}