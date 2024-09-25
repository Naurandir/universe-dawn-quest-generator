export interface TableHeaderElementModel {
    label: string,
    field: string,

    sortable: boolean,
    filterable: boolean,
    filterType?: string,

    arrow?: boolean,

    dropdown?: boolean,
    dropdownTags?: Map<string, "success"|"secondary"|"info"|"warning"|"danger"|"contrast">

    range?: boolean,
    rangeValueConfig?: number[],
    rangeValueSelected?: number[],

    desktopOnly?: boolean;
}
