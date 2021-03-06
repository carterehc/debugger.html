// @flow
import React, { Component } from "react";
import classNames from "classnames";
import Svg from "../../shared/Svg";
import { formatDisplayName, getLibraryFromUrl } from "../../../utils/frame";
import FrameMenu from "./FrameMenu";

import "./Group.css";

import FrameComponent from "./Frame";

import type { LocalFrame } from "./types";
import type { Frame } from "debugger-html";

type FrameLocationProps = { frame: Frame };
function FrameLocation({ frame }: FrameLocationProps) {
  const library = getLibraryFromUrl(frame);
  if (!library) {
    return null;
  }

  return (
    <div className="location">
      {library}
      <Svg name={library.toLowerCase()} className="annotation-logo" />
    </div>
  );
}

FrameLocation.displayName = "FrameLocation";

export default class Group extends Component {
  state: {
    expanded: boolean
  };

  toggleFrames: Function;

  props: {
    group: LocalFrame[],
    selectedFrame: LocalFrame,
    selectFrame: Function,
    toggleFrameworkGrouping: Function,
    copyStackTrace: Function,
    toggleBlackBox: Function,
    frameworkGroupingOn: boolean
  };

  constructor(...args: any[]) {
    super(...args);
    this.state = { expanded: false };
  }

  onContextMenu(event: SyntheticKeyboardEvent) {
    const {
      group,
      copyStackTrace,
      toggleFrameworkGrouping,
      toggleBlackBox,
      frameworkGroupingOn
    } = this.props;
    const frame = group[0];
    FrameMenu(
      frame,
      frameworkGroupingOn,
      { copyStackTrace, toggleFrameworkGrouping, toggleBlackBox },
      event
    );
  }

  toggleFrames = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderFrames() {
    const {
      group,
      selectFrame,
      selectedFrame,
      toggleFrameworkGrouping,
      frameworkGroupingOn,
      toggleBlackBox,
      copyStackTrace
    } = this.props;

    const { expanded } = this.state;
    if (!expanded) {
      return null;
    }

    return (
      <div className="frames-list">
        {group.map(frame => (
          <FrameComponent
            copyStackTrace={copyStackTrace}
            frame={frame}
            frameworkGroupingOn={frameworkGroupingOn}
            hideLocation={true}
            key={frame.id}
            selectedFrame={selectedFrame}
            selectFrame={selectFrame}
            shouldMapDisplayName={false}
            toggleBlackBox={toggleBlackBox}
            toggleFrameworkGrouping={toggleFrameworkGrouping}
          />
        ))}
      </div>
    );
  }

  renderDescription() {
    const frame = this.props.group[0];
    const displayName = formatDisplayName(frame);
    return (
      <li
        key={frame.id}
        className={classNames("group")}
        onClick={this.toggleFrames}
        tabIndex={0}
      >
        <div className="title">{displayName}</div>
        <FrameLocation frame={frame} />
      </li>
    );
  }

  render() {
    const { expanded } = this.state;
    return (
      <div
        className={classNames("frames-group", { expanded })}
        onContextMenu={e => this.onContextMenu(e)}
      >
        {this.renderDescription()}
        {this.renderFrames()}
      </div>
    );
  }
}

Group.displayName = "Group";
