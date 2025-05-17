// Mod to generate elements using OpenAI's ChatGPT API
// Creates a function generateElementFromLLM that fetches element data from the API
// and adds it to the global `elements` object.

async function generateElementFromLLM(description) {
    const apiKey = localStorage.getItem("openAIKey");
    if(!apiKey) {
        alert("OpenAI API key not found in localStorage under 'openAIKey'");
        return;
    }

    const messages = [
        {
            role: "system",
            content: "You are an assistant for Sandboxels. Respond ONLY with JSON representing a single element."
        },
        { role: "user", content: description }
    ];

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: messages
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json|```/g, "");
    const element = JSON.parse(content);
    elements[element.name] = element;
}
