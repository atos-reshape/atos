import { getAll639_1 } from 'all-iso-language-codes';

const languages = [...getAll639_1()] as const;
export type language = typeof languages[number];

export class CardFileUploadDto {
  tag: string;
  [key: language]: string;
}
