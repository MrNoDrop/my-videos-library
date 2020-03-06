function noError(payload = {}) {
  return { error: null, payload: { ...payload } };
}

const emptyRoute = field => field !== '\\//\\//\\//';

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
  error: { unknown: unknownError, unknownField: unknownFieldError }
};
