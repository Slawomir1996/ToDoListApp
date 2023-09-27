import { UserDtO } from './user.dto';

export interface ListEntry {
    id?: number;
    slug?: string;
    title?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    author?: UserDtO;
    isDone?: boolean;

    // id?: number;
    // title?: string;
    // slug?: string;
    // description?: string;
    // body?: string;
    // createdAt?: Date;
    // updatedAt?: Date;
    // likes?: number;
    // author?: User;
    // headerImage?: string;
    // publishedDate?: Date;
    // isPublished?: boolean;
}

export class Meta {
    totalItems?: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Links {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
}

export class ListEntriesPageable {
    items?: ListEntry[];
    meta?: Meta;
    links?: Links;
}
