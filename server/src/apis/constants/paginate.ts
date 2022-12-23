export interface IPaginate {
  sort: {
      [prop: string]: any
  };
  skip: number;
  limit: number;
}

export const buildPaginateOptions = (opts: Partial<IPaginate>) => {
  const arr:any[] = [];
  if (opts.sort) arr.push({ $sort: opts.sort });
  if (opts.skip) arr.push({ $skip: opts.skip });
  if (opts.limit) arr.push({ $limit: opts.limit });

  return arr;
}

