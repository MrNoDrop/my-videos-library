import React, { useRef } from 'react';
import { connect } from 'react-redux';
import images from '../../images';
import setViewmode from '../../store/actions/set/viewmode';
import './viewmode.scss';

const mapStateToProps = ({ state: { viewmode } }) => ({
  currentViewmode: viewmode
});
const mapDispatchToProps = dispatch => ({
  setViewmode: viewmode => dispatch(setViewmode(viewmode))
});
export const viewmodes = {
  list: 'list',
  horizontal: 'horizontal',
  vertical: 'vertical'
};
const allViewmodes = (() => Object.values(viewmodes))();
function ButtonViewmode({
  currentViewmode,
  setViewmode,
  viewmodes = allViewmodes,
  alterSelected = {},
  ...other
}) {
  const ref = useRef();
  for (let key in alterSelected) {
    if (typeof alterSelected[key] !== 'object') {
      alterSelected[key] = [alterSelected[key]];
    } else if (alterSelected[key].constructor.name !== 'Array') {
      alterSelected[key] = Object.values(alterSelected[key]);
    }
  }
  return (
    <div className="view-modes" {...{ ref, ...other }}>
      {viewmodes.map(viewmode => {
        switch (viewmode) {
          default:
            return '';
          case 'list':
            return (
              <images.interactive.viewmode.List
                className="viewmode"
                enabled={
                  alterSelected.list
                    ? alterSelected.list.includes(currentViewmode)
                    : currentViewmode === 'list'
                }
                onClick={() => setViewmode(viewmode)}
              />
            );
          case 'horizontal':
            return (
              <images.interactive.viewmode.Horizontal
                className="viewmode"
                enabled={
                  alterSelected.horizontal
                    ? alterSelected.horizontal.includes(currentViewmode)
                    : currentViewmode === 'horizontal'
                }
                onClick={() => setViewmode(viewmode)}
              />
            );
          case 'vertical':
            return (
              <images.interactive.viewmode.Vertical
                className="viewmode"
                enabled={
                  alterSelected.vertical
                    ? alterSelected.vertical.includes(currentViewmode)
                    : currentViewmode === 'vertical'
                }
                onClick={() => setViewmode(viewmode)}
              />
            );
        }
      })}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonViewmode);
