import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { CreateCardDto, PageOptionsDto } from './dtos';
import { wrap } from '@mikro-orm/core';
import { PaginatedResult } from '../helpers/pagination.helper';
import { CardTranslation } from './entities/card-translation.entity';
import { isValidISO639_1 } from '../helpers/is-iso-639_1.decorator';
import { TagService } from '../tag/tag.service';
import { FindOneOptionsDto } from './dtos/find-one-options.dto';
import { ALL_TRANSLATIONS } from './constants';
import { FindAllCardOptionsDto } from './dtos/find-all-card-options.dto';
import { Readable } from 'stream';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { CardFileUploadDto, language } from './dtos/card-file-upload.dto';
import { getAll639_1 } from 'all-iso-language-codes';
import { Tag } from '../tag/entities/tag.entity';
import { removeBomFromBuffer } from '../helpers/remove-bom.helper';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: EntityRepository<Card>,
    private readonly csvParser: CsvParser,
    private readonly tagService: TagService,
  ) {}

  /**
   * It flattens the response from the database to be returned to the client.
   * @param card - The card that needs to be flattened.
   * @param language - The language that needs to be used for the translation. Should be ISO 639-1.
   * @returns The flattened card.
   */
  private static flattenCard(card: Card, language?: string): Card {
    const translations = card.translations.getItems();
    const translationIndex = translations.findIndex((translation) =>
      language && translation.language
        ? translation.language === language
        : translation.isDefaultLanguage,
    );

    const flattenedCard = {
      ...card,
      text: translations[translationIndex].text,
    };
    delete flattenedCard.translations;

    return flattenedCard;
  }

  /**
   * Makes sure that at least and at most one translation is marked as default.
   * @param translations - The translations that need to be checked.
   */
  private static hasAtLeastAndAtMostOneDefaultLanguage(
    translations: CardTranslation[],
  ): void {
    // Make sure that at least one of the translations is set as the default.
    if (!translations.some((translation) => translation.isDefaultLanguage))
      throw new BadRequestException(
        'At least one translation must be set as default.',
      );

    // Make sure that not more than one translation is set as the default.
    if (
      translations.filter((translation) => translation.isDefaultLanguage)
        .length > 1
    )
      throw new ConflictException(
        'Only one translation can be set as default.',
      );
  }

  /**
   * Check if the language is a valid ISO 639-1 language code and throw an error if it isn't.
   * @param language - The language that needs to be checked.
   */
  private static isValidLanguage(language: string): void {
    if (!isValidISO639_1(language))
      throw new BadRequestException(
        `The language '${language}' is not a valid ISO 639-1 language code.`,
      );
  }

  /**
   * Check for each translation if it's language is a valid ISO 639-1 language code and throw an error if it isn't.
   * @param translations - The translations that need to be checked.
   */
  private static isValidLanguageOnTranslation(
    translations: CardTranslation[],
  ): void {
    translations.forEach((translation) =>
      CardService.isValidLanguage(translation.language),
    );
  }

  /**
   * Retrieve all cards from database.
   * @param findAllOptions - The options for the query.
   * @param pageOptions - Pagination options.
   * @returns An array of cards.
   */
  async findAll(
    findAllOptions: FindAllCardOptionsDto,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResult<Card>> {
    const { isActive, language, tag } = findAllOptions;

    const [cards, count] = await this.cardRepository.findAndCount(
      {},
      {
        filters: { isActive, ...(tag && { hasTag: { name: tag } }) },
        populate: ['translations'],
        limit: pageOptions.limit,
        offset: pageOptions.offset,
      },
    );

    // If language is *, return all translations. Otherwise, flatten the cards.
    return language === ALL_TRANSLATIONS
      ? [cards, count]
      : [
          cards
            .filter((card) =>
              card.translations.getItems().some((translation) =>
                // If language is defined, only return the translation for the given language, otherwise pick the default.
                language
                  ? translation.language === language
                  : translation.isDefaultLanguage,
              ),
            )
            .map((card) => CardService.flattenCard(card, language)),
          count,
        ];
  }

  /**
   * Retrieve a card from database.
   * @param id - The id of the card to retrieve.
   * @param findOneOptions - The options for the query.
   * @returns The card with the given id.
   */
  async findOne(id: string, findOneOptions: FindOneOptionsDto): Promise<Card> {
    const { language } = findOneOptions;
    const card = await this.cardRepository.findOne(id, {
      filters: { isActive: false },
      populate: ['translations'],
    });

    if (!card) throw new NotFoundException(`Card with id '${id}' not found.`);

    return language === ALL_TRANSLATIONS
      ? card
      : CardService.flattenCard(card, language);
  }

  /**
   * Create a new card in the database.
   * @param card - The data to create the card with.
   * @returns The created card.
   */
  async create(card: CreateCardDto): Promise<Card> {
    CardService.hasAtLeastAndAtMostOneDefaultLanguage(card.translations);
    CardService.isValidLanguageOnTranslation(card.translations);
    if (card.tag) {
      card.tag = (await this.tagService.findOne(card.tag)).id;
    }

    const newCard = this.cardRepository.create(card);
    await this.cardRepository.persistAndFlush(newCard);
    return newCard;
  }

  /**
   * Giving the user the ability to upload a .csv file containing cards, this method will create the cards in the database.
   * @param file - The .csv file.
   * @returns The created cards.
   */
  async createFromFile(file: Express.Multer.File): Promise<Card[]> {
    // Map the buffer to a stream.
    const stream = Readable.from(removeBomFromBuffer(file.buffer));

    // Parse the stream.
    const csv: ParsedData<CardFileUploadDto> = await this.csvParser.parse(
      stream,
      CardFileUploadDto,
      null,
      null,
      { separator: ',' },
    );

    // I assume that all tags are contained within a limit of 100.
    const [tags]: PaginatedResult<Tag> = await this.tagService.findAll({
      limit: 100,
    });

    // Map each tag to an id.
    const csvData: CardFileUploadDto[] = await Promise.all(
      csv.list.map(async (row: CardFileUploadDto) => ({
        ...row,
        tag: tags.find((t: Tag) => t.name === row.tag)?.id,
      })),
    );

    // Create the cards and return them.
    return await Promise.all(
      csvData.map(async (row: CardFileUploadDto) => {
        const possibleLanguages = getAll639_1();
        // Map [key: language]: string; from row to possibleLanguages.
        const languages: [language, string][] = Object.entries(row).filter(
          ([key]) => possibleLanguages.includes(key),
        );

        // Just pick the first language to be the default.
        const defaultLanguage = languages[0][0];

        return await this.create(
          new CreateCardDto({
            tag: row.tag,
            translations: languages.map(
              (entry) =>
                ({
                  isDefaultLanguage: entry[0] === defaultLanguage,
                  language: entry[0],
                  text: entry[1],
                } as CardTranslation),
            ),
          }),
        );
      }),
    );
  }

  /**
   * Update a card in the database.
   * @param id - The id of the card to update.
   * @param cardData - The data to update the card with.
   * @returns The updated card.
   */
  async update(id: string, cardData: CreateCardDto): Promise<Card> {
    const card = await this.findOne(id, { language: ALL_TRANSLATIONS });

    CardService.hasAtLeastAndAtMostOneDefaultLanguage(cardData.translations);
    CardService.isValidLanguageOnTranslation(cardData.translations);
    if (cardData.tag) {
      cardData.tag = (await this.tagService.findOne(cardData.tag)).id;
    }

    this.cardRepository.assign(card, cardData);
    card.translations.set(cardData.translations);
    await this.cardRepository.flush();

    return card;
  }

  /**
   * Mark a card as deleted and update it in the database.
   * @param id - The id of the card to delete.
   * @returns The deleted card.
   */
  async delete(id: string): Promise<void> {
    const card = await this.findOne(id, { language: ALL_TRANSLATIONS });
    if (card.deletedAt)
      throw new ConflictException(`Card with id ${id} already deleted`);

    wrap(card).assign({ ...card, deletedAt: new Date() } as Card);

    return await this.cardRepository.flush();
  }
}
