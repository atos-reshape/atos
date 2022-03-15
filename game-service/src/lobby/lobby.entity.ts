import {
    Entity, Property, Unique, Index, PrimaryKey
} from "@mikro-orm/core";

@Entity()
export class Lobby {
    // name?: means nullable

    @PrimaryKey()
    id!: string;
    
    @Property()
    @Unique()
    @Index()
    code!: string;

    @Property()
    title!: string;

    @Property()
    cardSetId?: string;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

}