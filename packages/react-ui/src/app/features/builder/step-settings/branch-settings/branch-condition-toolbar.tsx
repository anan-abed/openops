import { Button } from '@openops/components/ui';
import { t } from 'i18next';

type BranchConditionToolbarProps = {
  onAnd: () => void;
  onOr: () => void;
  showOr: boolean;
  showAnd: boolean;
  readonly: boolean;
};

const BranchConditionToolbar = (props: BranchConditionToolbarProps) => {
  return (
    <div className="flex gap-2 text-center justify-start">
      {props.showAnd && (
        <Button
          variant="basic"
          size="sm"
          onClick={props.onAnd}
          disabled={props.readonly}
        >
          {t('+ And')}
        </Button>
      )}

      {props.showOr && (
        <Button
          variant="basic"
          size="sm"
          onClick={props.onOr}
          disabled={props.readonly}
        >
          {t('+ Or')}
        </Button>
      )}
    </div>
  );
};

BranchConditionToolbar.displayName = 'BranchConditionToolbar';
export { BranchConditionToolbar };
