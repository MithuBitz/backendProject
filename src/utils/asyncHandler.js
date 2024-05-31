//This helps to run any funtion in try catch block or promise with async/await

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((e) => next(e));
  };
};

//Create async try catch handler higher order function to use as a utility
const asyncHandlerTC = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { asyncHandler, asyncHandlerTC }
