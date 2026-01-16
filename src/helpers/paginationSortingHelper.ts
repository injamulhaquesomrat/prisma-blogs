type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

export const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;

  const skip = (Number(page) - 1) * Number(limit);

  const sortOrder: string = options.sortOrder || "asc";
  const sortBy: string = options.sortBy || "createdAt";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
