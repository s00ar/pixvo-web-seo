import { format } from "date-fns";
import { es } from "date-fns/locale";

const dateFormat = (
  date: Date | string,
  pattern: string = "d 'de' MMMM 'de' yyyy",
): string => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern, { locale: es });
  return output;
};

export default dateFormat;
