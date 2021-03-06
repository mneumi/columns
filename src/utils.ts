interface CheckCondition {
  format?: string[];
  size?: number;
}

type ErrorType = 'size' | 'format' | null;

export const beforeUploadCheck = (
  file: File,
  condition: CheckCondition
): { passed: boolean; error: ErrorType } => {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;

  let error: ErrorType = null;

  if (!isValidFormat) {
    error = 'format';
  }

  if (!isValidSize) {
    error = 'size';
  }

  return {
    passed: isValidSize && isValidFormat,
    error,
  };
};

export const parseTimestampToDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp));

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0');
  const hour = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const minute = date
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const second = date
    .getSeconds()
    .toString()
    .padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};
