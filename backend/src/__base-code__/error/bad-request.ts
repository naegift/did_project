export const badRequest = (message: string) => {
  return {
    schema: {
      example: {
        message,
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  };
};
