import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>();
  const [improvedText, setImprovedText] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    chrome.storage.local.get(['apiKey'], (result) => {
      if (result['apiKey'] !== undefined) {
        setApiKey(result['apiKey']);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedText || !apiKey) {
      return;
    }
    setLoading(true);
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Improve following text: """${selectedText}"""`,
        },
      ],
    };

    // Make the API request
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    console.log('calling the API');
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const improvedText = jsonResponse.choices?.[0]?.message?.content;
        console.log('json repsonse', improvedText);
        setImprovedText(improvedText);
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(false));
  }, [selectedText, apiKey]);

  const getSelectedText = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id || 0 },
        func: () => window?.getSelection()?.toString(),
      },
      (results) => {
        setSelectedText(results[0].result);
      },
    );
  };

  useEffect(() => {
    getSelectedText();
  }, []);
  return (
    <div>
      <h1>AI Co-Writer</h1>
      <h4>Original text:</h4>
      <p>{selectedText}</p>
      <h4>Improved text:</h4>
      {loading && <p>Loading...</p>}
      {!loading && improvedText && (
        <div>
          <p>{improvedText}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(improvedText);
            }}
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
