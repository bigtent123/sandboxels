function openAiElementPrompt() {
    const apiKey = localStorage.getItem("openAiKey") || prompt("Enter OpenAI API key");
    if (!apiKey) { return; }
    localStorage.setItem("openAiKey", apiKey);
    const userPrompt = prompt("Describe the element you want to create:");
    if (!userPrompt) { return; }
    const system = "You generate a JSON object describing a new Sandboxels element. The JSON must have fields name,color,behavior,category. The name must be unique and not conflict with existing element names.";
    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: system },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7
        })
    }).then(r => r.json()).then(data => {
        try {
            const element = JSON.parse(data.choices[0].message.content);
            if (elements[element.name]) {
                alert("Element already exists: " + element.name);
                return;
            }
            elements[element.name] = {
                color: element.color || "#ffffff",
                behavior: element.behavior || behaviors.POWDER,
                category: element.category || "powders"
            };
            createElementButton(element.name);
            alert("Created element: " + element.name);
        } catch (e) {
            console.error(e);
            alert("Could not parse LLM response");
        }
    }).catch(e => {
        console.error(e);
        alert("OpenAI request failed");
    });
}

runAfterLoad(function() {
    document.addEventListener("keydown", function(e) {
        if (e.key === "L" && (e.shiftKey || shiftDown)) {
            openAiElementPrompt();
        }
    });
});
