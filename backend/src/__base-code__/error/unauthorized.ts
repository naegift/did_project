export const unauthorized = (message: string) => {
  return {
    schema: {
      example: {
        message,
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  };
};
