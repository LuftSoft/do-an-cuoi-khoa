import { Tooltip } from '@mui/material';
import type { FC } from 'react';

import HTMLInjection from './HTMLInjection';

import { shortenString } from 'utils/string.helper';

type ShortenedStringWithTooltipProps = {
  text?: string;
  htmlText?: string;
  maxLength?: number;
};
const ShortenedStringWithTooltip: FC<ShortenedStringWithTooltipProps> = ({
  text,
  maxLength,
  htmlText,
}) => {
  const shortened = shortenString(text, maxLength);
  return (
    <Tooltip
      title={htmlText ? <HTMLInjection htmlText={htmlText} /> : text}
      sx={{
        '& .MuiTooltip-tooltip': {
          fontSize: '20px',
        },
      }}
    >
      <div>{shortened}</div>
    </Tooltip>
  );
};

export default ShortenedStringWithTooltip;
