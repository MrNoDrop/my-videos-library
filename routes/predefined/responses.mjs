function noError(payload = {}) {
  return { error: null, payload: { ...payload } };
}

const emptyRoute = field => field !== '\\//\\//\\//';

function missingFileError(
  routeFieldInfo = { index: -1, value: null },
  routeFields = ['\\//\\//\\//'],
  payload = null,
  message = 'Missing file'
) {
  try {
    throw new Error(
      `${message.replace('.', '')} at location: /${routeFields.join('/')}`
    );
  } catch (err) {
    console.error(err);
  }
  return {
    error: {
      type: 'Missing file',
      message: message,
      field: routeFieldInfo,
      fields: routeFields.filter(emptyRoute)
    },
    payload: (payload && { ...payload }) || payload
  };
}
function unknownError(
  routeFieldInfo = { index: -1, value: null },
  routeFields = ['\\//\\//\\//'],
  payload = null,
  message = null
) {
  return {
    error: {
      type: 'Unknown',
      message: message || 'Unknown error.',
      field: routeFieldInfo,
      fields: routeFields.filter(emptyRoute)
    },
    payload: (payload && { ...payload }) || payload
  };
}
function unknownFieldError(
  routeFieldInfo = { index: -1, value: null },
  routeFields = ['\\//\\//\\//'],
  payload = null,
  message = null
) {
  return {
    error: {
      type: 'Unknown field',
      message: message || 'Field does not exists.',
      field: routeFieldInfo,
      fields: routeFields.filter(emptyRoute)
    },
    payload: (payload && { ...payload }) || payload
  };
}
export default {
  ok: noError,
  error: {
    unknown: unknownError,
    unknownField: unknownFieldError,
    missing: { file: missingFileError }
  }
};
