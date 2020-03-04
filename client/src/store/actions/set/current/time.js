// import SET_CURRENT_TIME from '../../types';

export default (currenttime = {}) => ({
  type: 'SET_CURRENT_TIME',
  payload: {
    currenttime: { ...currenttime }
  }
});
