export const notAcceptable = (message: string) => {
  return {
    schema: {
      example: {
        message,
        error: 'Not Acceptable',
        statusCode: 406,
      },
    },
  };
};
