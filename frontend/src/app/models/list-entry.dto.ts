import { UserDtO } from './user.dto';

export interface ListEntry {
    id?: number;
    slug: string;
    title: string;
    body: string;
    createdAt: Date;
    startAt: string;
    author: UserDtO;
    isDone: boolean;
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
