import useGetExtensionSetting, {
  Setting,
} from '../hooks/useGetExtensionSetting';
import React, { useEffect, useState } from 'react';

const Settings: React.FC = () => {
  const [setting, setSetting] = useState<Setting>({
    apiKey: '',
    onlyGrammarCorrection: false,
  });
  // Load settings from storage when the component mounts
  const savedSetting = useGetExtensionSetting();
  useEffect(() => {
    setSetting({ ...setting, ...savedSetting });
  }, [savedSetting]);

  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'onlyGrammarCorrection'], (result) => {
      console.log('result', result);
      if (result['apiKey'] !== undefined) {
        setSetting({ ...setting, ...result });
      }
    });
  }, []);

  const handleSave = () => {
    // Save settings to chrome.storage
    console.log(setting);
    chrome.storage.local.set(setting, () => {
      alert('Settings saved');
    });
  };

  return (
    <div>
      <div>
        ChatGPT API Key:
        <input
          type="text"
          value={setting.apiKey}
          onChange={(e) => {
            setSetting({ ...setting, apiKey: e.target.value });
          }}
        />
      </div>
      <div>
        <label htmlFor="myCheckbox">Correct grammar only:</label>
        <input
          type="checkbox"
          id="myCheckbox"
          name="myCheckbox"
          checked={setting.onlyGrammarCorrection}
          onChange={(e) => {
            setSetting({ ...setting, onlyGrammarCorrection: e.target.checked });
          }}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
