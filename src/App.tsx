import useGetChatGPTResponse from './hooks/useGetChatGPTResponse';
import useGetExtensionSetting from './hooks/useGetExtensionSetting';
import React, { useEffect, useState } from 'react';

const getMessageTemplate = ({
  selectedText,
  onlyGrammarCorrection,
}: {
  selectedText: string;
  onlyGrammarCorrection: boolean;
}): string => {
  if (!selectedText) {
    return '';
  }
  if (onlyGrammarCorrection) {
    return `Correct grammar for the following text, answer directly without adding any context or explanation: """${selectedText}"""`;
  }
  return `Improve writing for following sentence, answer directly without adding any context or explanation: : """${selectedText}"""`;
};

const App: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const { apiKey, onlyGrammarCorrection } = useGetExtensionSetting();

  const { result, loading } = useGetChatGPTResponse(
    getMessageTemplate({ selectedText, onlyGrammarCorrection }),
    apiKey,
  );

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
        setSelectedText(results[0].result || '');
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
      <p>{selectedText || 'Please select a text to continue...'}</p>
      <h4>Improved text{onlyGrammarCorrection && ' (Grammar Only)'}:</h4>
      {loading && <p>Loading...</p>}
      {!loading && result && (
        <div>
          <p>{result}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
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
