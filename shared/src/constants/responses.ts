export const ResponseMessage = {
  CREATED: 'Created',
  UPDATED:'Updated',
  SUCCESS: 'Success',
  DELETED:"Deleted",
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Record Not Found',
  INTERNAL_SERVER_ERROR: 'Something Went Wrong',
};

export const successResponse = (
  statusCode: number = 200,
  message: string = 'Success',
  data: any = {},
  pagination?: {
    count: number;
    page: number;
    limit: number;
  }
) => {
  if (pagination) {
    const { count, page, limit } = pagination;
    return {
      statusCode,
      message,
      data,
      count: count,
      pagination:
        Array.isArray(data) && count && limit
          ? {
              page,
              limit,
              totalPages: Math.ceil(count / limit),
              resultCount: data.length,
              totalResult: count,
            }
          : null,
      error: null,
    };
  } else {
    return {
      statusCode,
      message,
      data,
      error: null,
    };
  }
};
