import useGetChatGPTResponse from './hooks/useGetChatGPTResponse';
import useGetExtensionSetting from './hooks/useGetExtensionSetting';
import React, { useEffect, useState } from 'react';
import './App.css';

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

  if (!apiKey) {
    return (
      <div>
        <h2>Please setup your API key first</h2>
      </div>
    );
  }

  return (
    <div className={'popupContainer'}>
      <h2 className={'titleText'}>Original text:</h2>
      <p className={'bodyText'}>
        {selectedText || 'Please select a text to continue...'}
      </p>
      <h2 className={'titleText'}>
        Improved text{onlyGrammarCorrection && ' (Grammar Only)'}:
      </h2>
      {loading && <p className={'bodyText'}>Loading...</p>}
      {!loading && result && (
        <div>
          <p className={'bodyText'}>{result}</p>
          <button
            className="copyButton"
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
