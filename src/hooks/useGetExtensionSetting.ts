import { useEffect, useState } from 'react';

export type Setting = {
  apiKey: string;
  onlyGrammarCorrection: boolean;
};

const useGetExtensionSetting = (): Setting => {
  const [setting, setSetting] = useState<Setting>({
    apiKey: '',
    onlyGrammarCorrection: false,
  });
  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'onlyGrammarCorrection'], (result) => {
      setSetting({ ...setting, ...result });
    });
  }, []);
  return setting;
};

export default useGetExtensionSetting;
