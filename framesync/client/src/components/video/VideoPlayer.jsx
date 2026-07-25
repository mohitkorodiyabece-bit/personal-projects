import React, { forwardRef } from 'react';

const VideoPlayer = forwardRef(({ src, onTimeUpdate, onLoadedMetadata }, ref) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black">
      <video
        ref={ref}
        src={src}
        controls
        className="aspect-video w-full"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;