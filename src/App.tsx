import useGetChatGPTResponse from './hooks/useGetChatGPTResponse';
import useGetExtensionSetting from './hooks/useGetExtensionSetting';
import React, { useEffect, useState } from 'react';

import styles from './styles.module.css';
import './global.css';

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
    <div className={styles.popupContainer}>
      <h2 className={styles.titleText}>Original text:</h2>
      <p className={styles.bodyText}>
        {selectedText || 'Please select a text to continue...'}
      </p>
      <h2 className={styles.titleText}>
        Improved text{onlyGrammarCorrection && ' (Grammar Only)'}:
      </h2>
      {loading && <p className={'bodyText'}>Loading...</p>}
      {!loading && result && (
        <div>
          <p className={styles.bodyText}>{result}</p>
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
