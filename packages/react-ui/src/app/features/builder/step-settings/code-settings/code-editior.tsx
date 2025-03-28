import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import {
  Button,
  INTERNAL_ERROR_TOAST,
  cn,
  toast,
} from '@openops/components/ui';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror, { EditorState, EditorView } from '@uiw/react-codemirror';
import { t } from 'i18next';
import { BetweenHorizontalEnd, Package } from 'lucide-react';
import { useState } from 'react';

import { useTheme } from '@/app/common/providers/theme-provider';
import { SourceCode, deepMergeAndCast } from '@openops/shared';

import { AddNpmDialog } from './add-npm-dialog';

const styleTheme = EditorView.baseTheme({
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
});

type CodeEditorProps = {
  sourceCode: SourceCode;
  onChange: (sourceCode: SourceCode) => void;
  readonly: boolean;
  applyCodeToCurrentStep?: () => void;
};

const CodeEditior = ({
  sourceCode,
  readonly,
  onChange,
  applyCodeToCurrentStep,
}: CodeEditorProps) => {
  const { code, packageJson } = sourceCode;
  const [activeTab, setActiveTab] = useState<keyof SourceCode>('code');
  const [language, setLanguage] = useState<'typescript' | 'json'>('typescript');
  const codeApplicationEnabled = typeof applyCodeToCurrentStep === 'function';
  const { theme } = useTheme();

  const codeEditiorTheme = theme === 'dark' ? githubDark : githubLight;

  const extensions = [
    styleTheme,
    EditorState.readOnly.of(readonly),
    EditorView.editable.of(!readonly),
    language === 'json' ? json() : javascript({ jsx: false, typescript: true }),
  ];

  function handlePackageClick() {
    setActiveTab('packageJson');
    setLanguage('json');
  }

  function handleCodeClick() {
    setActiveTab('code');
    setLanguage('typescript');
  }

  function handleAddPackages(packageName: string, packageVersion: string) {
    try {
      const json = deepMergeAndCast(JSON.parse(packageJson), {
        dependencies: {
          [packageName]: packageVersion,
        },
      });
      setActiveTab('packageJson');
      onChange({ code, packageJson: JSON.stringify(json, null, 2) });
    } catch (e) {
      console.error(e);
      toast(INTERNAL_ERROR_TOAST);
    }
  }

  return (
    <div className="flex flex-col gap-2 border rounded py-2 px-2">
      <div className="flex flex-row justify-center items-center h-full">
        <div className="flex justify-start gap-4 items-center">
          <div
            className={cn('text-sm cursor-pointer', {
              'font-bold': activeTab === 'code',
            })}
            onClick={() => handleCodeClick()}
          >
            {t('Code')}
          </div>
          <div
            className={cn('text-sm cursor-pointer', {
              'font-bold': activeTab === 'packageJson',
            })}
            onClick={() => handlePackageClick()}
          >
            {t('Dependencies')}
          </div>
        </div>
        <div className="flex flex-grow"></div>
        {codeApplicationEnabled ? (
          <Button
            variant="outline"
            className="flex gap-2"
            size={'sm'}
            onClick={applyCodeToCurrentStep}
          >
            <BetweenHorizontalEnd className="w-3 h-3" />
            {t('Apply code')}
          </Button>
        ) : (
          <AddNpmDialog onAdd={handleAddPackages}>
            <Button
              variant="outline"
              className="flex gap-2"
              size={'sm'}
              onClick={() => {}}
            >
              <Package className="w-4 h-4" />
              {t('Add package')}
            </Button>
          </AddNpmDialog>
        )}
      </div>
      <CodeMirror
        value={activeTab === 'code' ? code : packageJson}
        className="border-none"
        height="250px"
        width="100%"
        maxWidth="100%"
        basicSetup={{
          foldGutter: false,
          lineNumbers: true,
          searchKeymap: false,
          lintKeymap: true,
          autocompletion: true,
        }}
        lang="typescript"
        onChange={(value) => {
          onChange(
            activeTab === 'code'
              ? { code: value, packageJson }
              : { code, packageJson: value },
          );
        }}
        theme={codeEditiorTheme}
        readOnly={readonly}
        extensions={extensions}
      />
    </div>
  );
};

export { CodeEditior };
