export const notFound = (message: string) => {
  return {
    schema: {
      example: {
        message,
        error: 'Not Found',
        statusCode: 404,
      },
    },
  };
};
