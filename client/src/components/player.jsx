import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import savePlayer from "../store/actions/save/player";
import deletePlayer from "../store/actions/delete/player";
import shaka from "shaka-player";

shaka.polyfill.installAll();

const mapStateToProps = ({ state: { players } }) => ({
  players,
});

const mapDispatchToProps = (dispatch) => ({
  savePlayer: (players, player, video, src, initialized) =>
    dispatch(savePlayer(players, player, video, src, initialized)),
  deletePlayer: (players, src) => dispatch(deletePlayer(players, src)),
});

function Player({
  players,
  src,
  savePlayer,
  deletePlayer,
  onPlayerLoaded = () => {},
  onPlayerError = () => {},
  onLoadedMetadata = () => {},
  getVideo = () => {},
  init,
  ...other
}) {
  const ref = useRef();
  const [player] = useState(players[src]?.player || new shaka.Player());
  const [video] = useState(players[src]?.video || <video ref={ref} />);
  const [playerAttached, setPlayerAttached] = useState(false);

  useEffect(() => {
    if (src && player && video && !players[src]) {
      savePlayer(players, player, video, src, false);
    }
  }, [players[src], player, video, src]);
  useEffect(() => {
    if (players[src] && !players[src].initialized && init) {
      player
        .load(src)
        .then((e) => {
          onPlayerLoaded(e);
          savePlayer(players, player, video, src, true);
        })
        .catch(onPlayerError);
    }
  }, [players[src], init]);
  useEffect(() => {
    if (video?.ref?.current && !playerAttached) {
      getVideo(video.ref.current);
      player.attach(video.ref.current);
      setPlayerAttached(true);
    }
  }, [video?.ref?.current, playerAttached]);
  useEffect(() => () => deletePlayer(players, src), []);
  return React.cloneElement(video, {
    onLoadedMetadata: (e) => {
      onLoadedMetadata(e);
      player.configure({
        streaming: {
          bufferBehind: video.ref.current.duration,
        },
      });
    },
    ...other,
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
