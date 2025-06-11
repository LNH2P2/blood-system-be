export const ResponseOnlyMessage = (statusCode: number, message: string) => {
  return {
    statusCode: statusCode,
    message: message
  }
}
