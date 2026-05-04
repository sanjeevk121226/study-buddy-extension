
async function getTextFromPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (results) => {
      resolve(results[0].result);
    });
  });
}

// aicall function
async function callAI(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    // check if request failed
    if (!response.ok) {
      const errorText = await response.text();
      return "API Error: " + errorText;
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "No response from AI";
    }

  } catch (error) {
    return "Error: " + error.message;
  }
}

//summarizebutton
 document.getElementById("summarize").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.value = "Loading...";

  const text = await getTextFromPage();

  const prompt = `Summarize this text in a clear, concise, exam-ready way:\n${text}`;
  const result = await callAI(prompt);

  output.value = result;
});

//flashcardsbutton
 document.getElementById("flashcards").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.value = "Generating flashcards...";

  const text = await getTextFromPage();

  const prompt = `Convert this into 5 clear Q&A flashcards:\n${text}`;
  const result = await callAI(prompt);

  output.value = result;
});