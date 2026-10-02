import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
  type ArticleStateType,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const containerRef = useRef<HTMLElement>(null);
  const handleToggle = (): void => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };
  const handleFormChange = <K extends keyof ArticleStateType>(
    key: K,
    value: ArticleStateType[K]
  ): void => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };
  const handleReset = (): void => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      <aside
        ref={containerRef}
        className={clsx(styles.container, { [styles.container_open]: isOpen })}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Select
            title="Шрифт"
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={(option) => handleFormChange('fontFamilyOption', option)}
          />

          <Separator />

          <RadioGroup
            title="Размер шрифта"
            name="font-size"
            selected={formState.fontSizeOption}
            options={fontSizeOptions}
            onChange={(option) => handleFormChange('fontSizeOption', option)}
          />

          <Separator />

          <Select
            title="Цвет текста"
            selected={formState.fontColor}
            options={fontColors}
            onChange={(option) => handleFormChange('fontColor', option)}
          />

          <Separator />

          <Select
            title="Цвет фона"
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={(option) => handleFormChange('backgroundColor', option)}
          />

          <Separator />

          <RadioGroup
            title="Ширина контента"
            name="content-width"
            selected={formState.contentWidth}
            options={contentWidthArr}
            onChange={(option) => handleFormChange('contentWidth', option)}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
